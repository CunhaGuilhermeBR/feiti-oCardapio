import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { SaleRepository } from '@/repositories/sale'

class MakeSaleRepository {
	private constructor() {}

	public static execute(): SaleRepository {
		return SaleRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeSaleRepository.execute()
