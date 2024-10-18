import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { ConfigQuestionnaireRepository } from '@/repositories/configQuestionnaire'

class MakeConfigQuestionnaireRepository {
	private constructor() {}

	public static execute(): ConfigQuestionnaireRepository {
		return ConfigQuestionnaireRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeConfigQuestionnaireRepository.execute()
