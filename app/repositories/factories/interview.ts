import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { InterviewRepository } from '@/repositories/interview'

class MakeInterviewRepository {
	private constructor() {}

	public static execute(): InterviewRepository {
		return InterviewRepository.getInstance(
			prisma
		)
	}
}

export default MakeInterviewRepository.execute()
