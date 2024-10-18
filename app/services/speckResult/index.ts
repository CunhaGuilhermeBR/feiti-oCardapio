import { logger } from '@/infrastructure/logger'
import { SpeckResultRepository } from '@/repositories/speckResult'
import { NotFoundError } from '@/services/errors'

export class SpeckResultService {
	private speckResultRepository: SpeckResultRepository
	private static instance: SpeckResultService

	public static getInstance(
		speckResultRepository: SpeckResultRepository) {
		if (!this.instance) {
			this.instance = new SpeckResultService(speckResultRepository)
		}
		return this.instance
	}

	private constructor(
		speckResultRepository: SpeckResultRepository) {
		this.speckResultRepository = speckResultRepository
	}

	public async createSpeckResult(data: any) {
		logger.info(`Creating speck result for interview with id:${data.interview.id} `)
		return this.speckResultRepository.create({
			interviewId: data.interview.id,
			pdfReportFile: data.pdfReportFile,
			configSpeckResultId: data.configSpeckResultId
		})
	}

	public async findOne(id: number) {
		logger.info(`Finding SpeckResult for id: ${id}`)
		const result = await this.speckResultRepository.findById(id)
		if (!result) {
			throw new NotFoundError('Speck result', 'id')
		}
		return result
	}

	public async findOneByInterview(id: string) {
		logger.info(`Finding SpeckResult for interview: ${id}`)
		const result = await this.speckResultRepository.findByInterview(id)
		if (!result) {
			throw new NotFoundError('Speck result', 'id')
		}
		return result
	}
}
