import { logger } from '@/infrastructure/logger'
import { CourseRepository } from '@/repositories/course'
import { RecommendationRepository } from '@/repositories/recommendation'

export class RecommendationService {
	private static instance: RecommendationService
	private recommendationRepository: RecommendationRepository
	private courseRepo: CourseRepository

	public static getInstance(
		recommendationRepository: RecommendationRepository,
		courseRepo: CourseRepository
	) {
		if (!this.instance) {
			this.instance = new RecommendationService(
				recommendationRepository,
				courseRepo
			)
		}
		return this.instance
	}

	private constructor(recommendationRepository: RecommendationRepository, courseRepo: CourseRepository) {
		this.recommendationRepository = recommendationRepository
		this.courseRepo = courseRepo
	}


	public async createARecommendation(interviewID: string, courseName: string) {
		const course = await this.courseRepo.findByShortName(courseName)
		logger.info(`Creating a recommendation for interview ${interviewID} and course ${course.name}`)
		return this.recommendationRepository.create(course.name, interviewID)
	}

	public findManyByInterviewId(interviewID: string) {
		logger.info(`Finding recommendations for interview ${interviewID}`)

		return this.recommendationRepository.findManyByInterviewId(interviewID)
	}
	
}
