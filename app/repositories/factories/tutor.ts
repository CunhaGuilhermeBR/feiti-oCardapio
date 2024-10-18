import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { TutorRepository } from '@/repositories/tutor'

class MakeTutorRepository {
	private constructor() {}

	public static execute(): TutorRepository {
		return TutorRepository.getInstance(
			prisma,
		)
	}
}

export default MakeTutorRepository.execute()
