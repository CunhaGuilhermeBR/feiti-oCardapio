import { logger } from '@/infrastructure/logger'
import { ConfigQuestionRepository } from '@/repositories/configQuestion'
import { InterviewQuestionRepository } from '@/repositories/interviewQuestion'
import { NotFoundError } from '@/services/errors'
import { InterviewQuestionDTO, UpdateInterviewQuestionDTO } from './types'


export class InterviewQuestionService {
	private interviewQuestionRepository: InterviewQuestionRepository
	private configQuestionRepository: ConfigQuestionRepository

	private static instance: InterviewQuestionService

	public static getInstance(
		interviewQuestionRepository: InterviewQuestionRepository,
		configQuestionRepository: ConfigQuestionRepository) {
		if (!this.instance) {
			this.instance = new InterviewQuestionService(
				interviewQuestionRepository,
				configQuestionRepository
			)
		}
		return this.instance
	}

	private constructor(
		interviewQuestionRepository: InterviewQuestionRepository,
		configQuestionRepository: ConfigQuestionRepository) {
		this.interviewQuestionRepository = interviewQuestionRepository
		this.configQuestionRepository = configQuestionRepository
	}

	public async create(data: InterviewQuestionDTO) {
		logger.info(`Creating Interview Question for body: ${data}`)
		const existsConfig = await this.configQuestionRepository.findById(data.configQuestionId)
		if (!existsConfig) {
			throw new NotFoundError('Config Question', 'id')
		}
		return await this.interviewQuestionRepository.create(data)
	}

	public async findOne(index: number, questionnaireId: number) {
		logger.info(`Finding Interview Question for index: ${index} on questionnaire ${questionnaireId}`)
		const result = await this.interviewQuestionRepository.findById(index, questionnaireId)
		if (!result) {
			throw new NotFoundError('Interview Question', 'index/questionnaireId')
		}
		return result
	}

	public async findByQuestionnaire(questionnaireId: number) {
		logger.info(`Finding Interview Question on questionnaire ${questionnaireId}`)
		const result = await this.interviewQuestionRepository.findAllByQuestionnaire(questionnaireId)
		if (!result) {
			throw new NotFoundError('Interview Question', 'questionnaireId')
		}
		return result
	}

	public async update(data: UpdateInterviewQuestionDTO, index: number, questionnaireId: number) {
		logger.info(`Update Interview Question for index: ${index} on questionnaire ${questionnaireId}`)
		const exists = await this.interviewQuestionRepository.findById(index, questionnaireId)
		if (!exists) {
			throw new NotFoundError('Interview Question', 'index/questionnaireId')
		}
		const existsConfig = await this.configQuestionRepository.findById(exists.configQuestionId)
		if (!existsConfig) {
			throw new NotFoundError('Config Question', 'id')
		}
		if(data.configQuestion){
			await this.configQuestionRepository.update(data.configQuestion, exists.configQuestionId)
			delete data.configQuestion
		}
		return await this.interviewQuestionRepository.update(data, index, questionnaireId)

	}

	public async delete(index: number, questionnaireId: number) {
		logger.info(`Removing Interview Question for index: ${index} on questionnaire ${questionnaireId}`)
		return await this.interviewQuestionRepository.delete(index, questionnaireId)
	}
}
