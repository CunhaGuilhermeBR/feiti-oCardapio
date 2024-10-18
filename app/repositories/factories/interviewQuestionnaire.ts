import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { InterviewQuestionnaireRepository } from '@/repositories/interviewQuestionnaire'

class MakeInterviewQuestionnaireRepository {
	private constructor() {}

	public static execute(): InterviewQuestionnaireRepository {
		return InterviewQuestionnaireRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeInterviewQuestionnaireRepository.execute()
