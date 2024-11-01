import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { CategoryRepository } from '@/repositories/category'

class MakeCategoryRepository {
	private constructor() {}

	public static execute(): CategoryRepository {
		return CategoryRepository.getInstance(
			prisma,
		)
	}
}

export default MakeCategoryRepository.execute()
