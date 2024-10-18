import { logger } from '@/infrastructure/logger'
import { EmailRepository } from '@/repositories/email'
import { NotFoundError } from '@/services/errors'
import { ApplicationEmail } from '@prisma/client'
import { EmailDTO, UpdateEmailDTO } from './types'

export class EmailService {
	private emailRepository: EmailRepository
	private static instance: EmailService

	public static getInstance(
		emailRepository: EmailRepository) {
		if (!this.instance) {
			this.instance = new EmailService(emailRepository)
		}
		return this.instance
	}

	private constructor(
		emailRepository: EmailRepository) {
		this.emailRepository = emailRepository
	}

	
	public async create(data: EmailDTO) {
		logger.info(`Creating email for application ${data.applicationId} `)
		return this.emailRepository.create(data)
	}

	public async findByApplication(id?: number, url?: string) {
		if (!id && !url) {
			throw new Error('Either id or url must be provided')
		}
		logger.info(`Finding email for application: ${id} ${url}`)
		const result = await this.emailRepository.findByApplication(id, url)
		if (!result) {
			throw new NotFoundError('Email', 'appId')
		}
		return result
	}

	public async update(data: UpdateEmailDTO, id: number) {
		logger.info(`Updating email for id: ${id}`)
		const result = await this.emailRepository.findOne(id)
		if (!result) {
			throw new NotFoundError('Application email', 'id')
		}
		return await this.emailRepository.update(data, id)
	}

	public async delete(id: number) {
		logger.info(`Remove email for id: ${id}`)
		const result = await this.emailRepository.findOne(id)
		if (!result) {
			throw new NotFoundError('Application email', 'id')
		}
		return await this.emailRepository.delete(id)
	}
}
