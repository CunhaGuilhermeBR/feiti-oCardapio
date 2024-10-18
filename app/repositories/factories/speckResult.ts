import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { SpeckResultRepository } from '@/repositories/speckResult'

class MakeSpeckResultRepository {
	private constructor() {}

	public static execute(): SpeckResultRepository {
		return SpeckResultRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeSpeckResultRepository.execute()
