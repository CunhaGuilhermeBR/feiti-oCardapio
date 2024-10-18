import { logger } from '@/infrastructure/logger'
import { CourseRepository } from '@/repositories/course'
import { NotFoundError } from '../errors'

export class CourseService {
	private static instance: CourseService
	private courseRepository: CourseRepository

	public static getInstance(
		courseRepository: CourseRepository
	) {
		if (!this.instance) {
			this.instance = new CourseService(courseRepository)
		}
		return this.instance
	}

	private constructor(
		courseRepository: CourseRepository
	) {
		this.courseRepository = courseRepository
	}


	public async findByShortName(courseName: string) {
		logger.info(`Finding Course by name ${courseName}`)
		const course = await this.courseRepository.findByShortName(courseName)
		if (!course) {
			throw new NotFoundError('course', 'name')
		}

		return course
	}

	public async findAll() {
		logger.info(`
			Finding all courses`)
		const courses = await this.courseRepository.findAll()
		if (!courses) {
			throw new NotFoundError('course', 'name')
		}

		return courses
	}

}
