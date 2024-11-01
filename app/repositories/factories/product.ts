import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { ProductRepository } from '@/repositories/product'

class MakeProductRepository {
	private constructor() {}

	public static execute(): ProductRepository {
		return ProductRepository.getInstance(
			prisma,
		)
	}
}

export default MakeProductRepository.execute()
