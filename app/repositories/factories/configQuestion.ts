import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { ConfigQuestionRepository } from '@/repositories/configQuestion'

class MakeConfigQuestionRepository {
	private constructor() {}

	public static execute(): ConfigQuestionRepository {
		return ConfigQuestionRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeConfigQuestionRepository.execute()
