import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { ApplicationRepository } from '@/repositories/application'

class MakeApplicationRepository {
	private constructor() {}

	public static execute(): ApplicationRepository {
		return ApplicationRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeApplicationRepository.execute()
