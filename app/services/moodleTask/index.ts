import { logger } from '@/infrastructure/logger'
import { MoodleTaskRepository } from '@/repositories/moodleTask'
import { NotFoundError } from '@/services/errors'


export class MoodleTaskService {
	private moodleTaskRepository: MoodleTaskRepository
	private static instance: MoodleTaskService

	public static getInstance(
		moodleTaskRepository: MoodleTaskRepository) {
		if (!this.instance) {
			this.instance = new MoodleTaskService(moodleTaskRepository)
		}
		return this.instance
	}

	private constructor(
		moodleTaskRepository: MoodleTaskRepository) {
		this.moodleTaskRepository = moodleTaskRepository
	}

	public async create(data: MoodleTaskDTO) {
		logger.info(`Creating Moodle Task for body: ${data}`)
		return await this.moodleTaskRepository.create(data)
	}

	public async findOne(name: string, courseName: string) {
		logger.info(`Find Moodle Task for name: ${name} on course ${courseName}`)
		const result = await this.moodleTaskRepository.findByName(name, courseName)
		if (!result) {
			throw new NotFoundError('Moodle Task', 'id')
		}
		return result
	}

	public async findAll() {
		logger.info('Finding all Moodle Tasks')
		const result = await this.moodleTaskRepository.getAll()
		if (!result) {
			throw new NotFoundError('Moodle Task', 'all')
		}
		return result
	}

	public async update(data: UpdateMoodleTaskDTO, name: string, courseName: string, id: number) {
		logger.info(`Update Moodle Task for name: ${name} on course ${courseName}`)
		const exists = await this.moodleTaskRepository.findByName(name, courseName)
		if (!exists) {
			throw new NotFoundError('Moodle Task', 'courseName_name')
		}
		const result = await this.moodleTaskRepository.update(data, id)
		return result
	}

	public async delete(id: number) {
		logger.info(`Removing Moodle Task for id: ${id}`)
		return await this.moodleTaskRepository.delete(id)
	}
}
