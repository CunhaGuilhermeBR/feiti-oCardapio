import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { ConfigSpeckResultRepository } from '@/repositories/configSpeckResult'

class MakeConfigSpeckResultRepository {
	private constructor() {}

	public static execute(): ConfigSpeckResultRepository {
		return ConfigSpeckResultRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeConfigSpeckResultRepository.execute()
