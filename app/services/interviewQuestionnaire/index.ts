import { logger } from '@/infrastructure/logger'
import { ConfigQuestionnaireRepository } from '@/repositories/configQuestionnaire'
import { InterviewQuestionnaireRepository } from '@/repositories/interviewQuestionnaire'
import { NotFoundError } from '@/services/errors'
import { InterviewQuestionnaireDTO, UpdateInterviewQuestionnaireDTO } from './types'
import { ConfigurableItemRepository } from '@/repositories/configurableItem'

export class InterviewQuestionnaireService {
	private interviewQuestionnaireRepository: InterviewQuestionnaireRepository
	private configQuestionnaireRepository: ConfigQuestionnaireRepository
	private configurableItemRepository: ConfigurableItemRepository
	private static instance: InterviewQuestionnaireService

	public static getInstance(
		interviewQuestionnaireRepository: InterviewQuestionnaireRepository,
		configQuestionnaireRepository: ConfigQuestionnaireRepository,
		configurableItemRepository: ConfigurableItemRepository) {
		if (!this.instance) {
			this.instance = new InterviewQuestionnaireService(
				interviewQuestionnaireRepository,
				configQuestionnaireRepository,
				configurableItemRepository
			)
		}
		return this.instance
	}

	private constructor(
		interviewQuestionnaireRepository: InterviewQuestionnaireRepository,
		configQuestionnaireRepository: ConfigQuestionnaireRepository,
		configurableItemRepository: ConfigurableItemRepository) {
		this.configurableItemRepository = configurableItemRepository
		this.interviewQuestionnaireRepository = interviewQuestionnaireRepository
		this.configQuestionnaireRepository = configQuestionnaireRepository
	}

	public async create(data: InterviewQuestionnaireDTO) {
		logger.info(`Creating Interview Questionnaire for body: ${data}`)
		const existsConfig = await this.configQuestionnaireRepository.findById(data.configQuestionnaireId)
		if (!existsConfig) {
			throw new NotFoundError('Config Questionnaire', 'id')
		}
		return await this.interviewQuestionnaireRepository.create(data)
	}

	public async findOne(id: number) {
		logger.info(`Finding Interview Questionnaire for id: ${id}`)
		const result = await this.interviewQuestionnaireRepository.findById(id)
		if (!result) {
			throw new NotFoundError('Interview Questionnaire', 'id')
		}
		return result
	}

	public async findAllByApplicationUrl(url: string) {
		logger.info('Finding all Interview Questionnaire')
		const result = await this.interviewQuestionnaireRepository.getAllByApplicationUrl(url)
		if (!result) {
			throw new NotFoundError('Interview Questionnaire', 'all')
		}
		return result
	}

	public async update(data: UpdateInterviewQuestionnaireDTO, id: number) {
		logger.info(`Update Interview Questionnaire for id: ${id}`)
		const exists = await this.interviewQuestionnaireRepository.findById(id)
		if (!exists) {
			throw new NotFoundError('Interview Questionnaire', 'id')
		}
		const existsConfig = await this.configQuestionnaireRepository.findById(exists.configQuestionnaireId)
		if (!existsConfig) {
			throw new NotFoundError('Config Questionnaire', 'id')
		}
		if(data.configurableItem){
			await this.configurableItemRepository.update(data.configurableItem, existsConfig.itemId)
			delete data.configurableItem
		}
		return await this.interviewQuestionnaireRepository.update(data, id)	
	}

	public async delete(id: number){
		logger.info(`Removing Interview Questionnaire for id: ${id}`)
		return await this.interviewQuestionnaireRepository.delete(id)
	}
}
