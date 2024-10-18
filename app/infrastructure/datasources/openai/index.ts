import OpenAI from 'openai'
import { logger } from '@/infrastructure/logger'
import { createCompletionInput, Messages } from './types'

export default class GPTWrapper {
	private openAI: OpenAI

	constructor() {
		this.openAI = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		})
	}

	public async createCompletion(
		data: createCompletionInput
	): Promise<OpenAI.Chat.Completions.ChatCompletion> {
		logger.info('Creating OpenAI completion', { data })
		logger.info('Fetching OpenAI chat model')
		const model = 'openAIChatModel'

		logger.info('Fetching OpenAI chat temperature')
		const temperature = 0

		logger.info('Creating OpenAI completion')

		const defaultResponseFormat: OpenAI.Chat.Completions.ChatCompletionCreateParams.ResponseFormat = {
			type: 'json_object',
		}

		const response = await this.openAI.chat.completions.create({
			model: model,
			messages: data.messages,
			temperature: temperature,
			response_format: data.response_format
				? data.response_format
				: defaultResponseFormat,
			seed: 22121998,
		})

		logger.info('Validating OpenAI completion response')
		if (!response.choices[0].message.content) {
			logger.error('OpenAI completion response content not found')
			throw new Error('OpenAI completion response content not found')
		}

		logger.info('Returning OpenAI completion')
		return response
	}

	public async chat(messages: Messages): Promise<string> {
		const completion = await this.openAI.chat.completions.create({
			model: 'gpt-4o-mini-2024-07-18',
			messages,
		})

		if (!completion.choices[0].message.content) {
			logger.error('OpenAI completion response content not found')
			throw new Error('OpenAI completion response content not found')
		}

		return completion.choices[0].message.content
	}
}
