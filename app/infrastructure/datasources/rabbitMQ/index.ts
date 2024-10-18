import { logger } from '@/infrastructure/logger'
import { Connection, Channel, connect, ConsumeMessage, Replies, Options } from 'amqplib'
import { consumeQueueSchema, SpeckResultQueue } from './types'
import { ConfigSpeckResult } from '@prisma/client'
import { sendDelayedSpeckResult } from '@/infrastructure/jobs/sendDelayedSpeckResult'
import { COSError } from '@/infrastructure/datasources/cos/errors'
import { EmailError } from '@/infrastructure/email/errors'
import zod from 'zod'

class RabbitMQWrapper {
	private static instance: RabbitMQWrapper
	private conn!: Connection
	private channel!: Channel
	private consumeQueue: string = process.env.SPECK_CONSUME_QUEUE
	private publishQueue: string = process.env.SPECK_PUBLISH_QUEUE
	private errorQueue: string = process.env.SPECK_ERROR_QUEUE

	private constructor() {}

	static async getInstance(): Promise<RabbitMQWrapper> {
		if (!RabbitMQWrapper.instance) {
			RabbitMQWrapper.instance = new RabbitMQWrapper()
			await RabbitMQWrapper.instance.init()
		}
		return RabbitMQWrapper.instance
	}

	private async init(): Promise<void> {
		try {
			this.conn = await connect(process.env.RABBIT_STRING_CONNECTION)
			this.channel = await this.conn.createChannel()
			await Promise.all([
				this.assertQueue(this.consumeQueue),
				this.assertQueue(this.publishQueue),
				this.assertQueue(this.errorQueue)
			])
			logger.info('RabbitMQ connection established')
			this.consume()
		} catch (error) {
			logger.error('Failed to establish RabbitMQ connection or channel', { error })
			throw error
		}
	}

	private async assertQueue(queue: string): Promise<Replies.AssertQueue> {
		return this.channel.assertQueue(queue, { durable: true })
	}

	private async _publish(
		queue: string,
		message: string,
		correlationId: string,
		replyToQueue: string,
		headers?: Record<string, any>
	): Promise<void> {
		logger.info(`Sending to queue ${queue} with correlation ID ${correlationId}`)
		this.channel.sendToQueue(queue, Buffer.from(message), {
			replyTo: replyToQueue,
			correlationId: correlationId,
			headers: headers
		} as Options.Publish)
	}

	public async publishInQueue(
		message: string,
		configSpeckResult: ConfigSpeckResult,
		correlationId: string,
		applicationName: string
	): Promise<void> {
		const headers = {
			origin: configSpeckResult.speckOrigin,
			token: configSpeckResult.speckApiToken,
			folder: applicationName.toLowerCase().split(' ').join('-')
		}

		await this._publish(this.publishQueue, message, correlationId, this.consumeQueue, headers)
	}

	public async publishInErrorQueue(message: string, correlationId: string): Promise<void> {
		await this._publish(this.errorQueue, message, correlationId, this.publishQueue)
	}

	public async close(): Promise<void> {
		try {
			await this.channel.close()
			await this.conn.close()
			logger.info('RabbitMQ connection closed')
		} catch (error) {
			logger.error('Failed to close RabbitMQ connection', { error })
		}
	}

	private consume(): void {
		this.channel.consume(this.consumeQueue, this.handleMessage.bind(this))
			.then(
				() => logger.info('Consumer created'),
				(error) => {
					logger.error('Error creating the consumer', { error })
					this.handleErrorWhileConsuming()
				}
			)
	}

	private async handleMessage(message: ConsumeMessage | null): Promise<void> {
		if (!message) {
			logger.info('No message to consume')
			return
		}

		try {
			logger.info(`Received message on queue: ${this.consumeQueue}`)
			const parsedMessage = this.parseMessageContent(message)
			await this.processMessage(parsedMessage)
			this.channel.ack(message)
			logger.info('Message consumed successfully')
		} catch (error) {
			await this.handleError(error, message)
		}
	}

	private parseMessageContent(message: ConsumeMessage): SpeckResultQueue {
		const contentDataParsed = consumeQueueSchema.safeParse(JSON.parse(message.content.toString()))

		if (!contentDataParsed.success || !message.properties.correlationId) {
			const errorInfo = {
				zodError: contentDataParsed.error,
				correlationId: message.properties.correlationId
			}
			logger.error('Error parsing message content', errorInfo)
			throw new Error('Invalid message format')
		}

		return {
			reference: contentDataParsed.data.reference,
			pdf: contentDataParsed.data.pdf,
			correlationId: message.properties.correlationId
		}
	}

	private async processMessage(data: SpeckResultQueue): Promise<void> {
		await sendDelayedSpeckResult(data)
	}

	private async handleError(error: unknown, message: ConsumeMessage): Promise<void> {
		logger.error('Error handling message', { error, correlationId: message.properties.correlationId })
		message.properties.timestamp = new Date()

		if (error instanceof COSError || error instanceof EmailError || error instanceof zod.ZodError) {
			this.channel.nack(message, false, true)
		} else {
			await this.publishInErrorQueue(JSON.stringify({ error: error instanceof Error ? error.message : error }), message.properties.correlationId)
			this.channel.nack(message, false, false)
		}
	}

	private handleErrorWhileConsuming(): void {
		this.channel.nackAll()
		setTimeout(() => {
			this.consume()
		}, 5000)
	}
}

export default RabbitMQWrapper