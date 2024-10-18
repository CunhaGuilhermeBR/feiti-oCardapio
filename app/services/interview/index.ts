import { logger } from '@/infrastructure/logger'
import { InterviewRepository } from '@/repositories/interview'
import { NotFoundError } from '@/services/errors'
import { InterviewDTO } from './types'


export class InterviewService {
	private interviewRepository: InterviewRepository
	private static instance: InterviewService

	public static getInstance(interviewRepository: InterviewRepository) {
		if (!this.instance) {
			this.instance = new InterviewService(interviewRepository)
		}
		return this.instance
	}

	private constructor(interviewRepository: InterviewRepository) {
		this.interviewRepository = interviewRepository
	}

	public async create(data: InterviewDTO) {
		logger.info(`Creating Interview for saleId: ${data.saleId} and using ${data.templateId} template!`)
		return await this.interviewRepository.create(data)
	}

	public async findOne(id: string) {
		logger.info(`Finding Interview for id: ${id}`)
		const result = await this.interviewRepository.findById(id)
		if (!result) {
			throw new NotFoundError('Interview', 'id')
		}
		return result
	}

	public async markAsResponded(id: string) {
		logger.info(`Marking Interview as responded for id: ${id}`)
		const interview = await this.interviewRepository.findById(id)
		if (!interview) {
			throw new NotFoundError('Interview', 'id')
		}
		return this.interviewRepository.update(interview.id, { responded: true })
	}
}
