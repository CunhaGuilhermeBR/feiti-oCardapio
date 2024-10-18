import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { InterviewQuestionRepository } from '@/repositories/interviewQuestion'

class MakeInterviewQuestionRepository {
	private constructor() {}

	public static execute(): InterviewQuestionRepository {
		return InterviewQuestionRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeInterviewQuestionRepository.execute()
