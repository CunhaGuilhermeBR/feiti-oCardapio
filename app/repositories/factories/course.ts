import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { CourseRepository } from '@/repositories/course'

class MakeCourseRepository {
	private constructor() {}

	public static execute(): CourseRepository {
		return CourseRepository.getInstance(
			prisma
		)
	}
}

export default MakeCourseRepository.execute()
