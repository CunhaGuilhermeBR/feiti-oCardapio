import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { ConfigurableItemRepository } from '@/repositories/configurableItem'

class MakeConfigurableItemRepository {
	private constructor() {}

	public static execute(): ConfigurableItemRepository {
		return ConfigurableItemRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeConfigurableItemRepository.execute()
