import { logger } from '@/infrastructure/logger'
import { MoodleSubmissionRepository } from '@/repositories/moodleSubmission'
import { NotFoundError } from '@/services/errors'
import { MoodleSubmissionDTO, UpdateMoodleSubmissionDTO } from './types'

export class MoodleSubmissionService {
	private moodleSubmissionRepository: MoodleSubmissionRepository
	private static instance: MoodleSubmissionService

	public static getInstance(
		moodleSubmissionRepository: MoodleSubmissionRepository) {
		if (!this.instance) {
			this.instance = new MoodleSubmissionService(moodleSubmissionRepository)
		}
		return this.instance
	}

	private constructor(
		moodleSubmissionRepository: MoodleSubmissionRepository) {
		this.moodleSubmissionRepository = moodleSubmissionRepository
	}

	public async create(data: MoodleSubmissionDTO) { 
		logger.info(`Creating Moodle Submission for body: ${data}`)
		return await this.moodleSubmissionRepository.create(data)
	}

	public async findOne(id: number) {
		logger.info(`Find Moodle Submission for id ${id}`)
		return await this.moodleSubmissionRepository.findOne(id)
	}

	public async findAll() {
		logger.info('Finding all Moodle Submissions')
		const result = await this.moodleSubmissionRepository.getAll()
		if (!result) {
			throw new NotFoundError('Moodle Submission', 'all')
		}
		return result
	}

	public async update(data: UpdateMoodleSubmissionDTO, id: number) {
		logger.info(`Update Moodle Submission for id: ${id}`)
		const exists = await this.moodleSubmissionRepository.findOne(id)
		if (!exists) {
			throw new NotFoundError('Moodle Submission', 'id')
		}
		const result = await this.moodleSubmissionRepository.update(data, id)
		return result
	}

	public async findAllByCourse(saleId: string, courseName: string){
		logger.info(`Getting all submissions for sale ${saleId} on course [${courseName}]`)
		const result = await this.moodleSubmissionRepository.findAllByUser(saleId, courseName)
		if (!result) {
			throw new NotFoundError('Moodle Submission', 'saleId CourseName')
		}
		return result
	}

}
