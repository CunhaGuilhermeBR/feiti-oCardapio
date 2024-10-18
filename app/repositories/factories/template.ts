import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { TemplateRepository } from '@/repositories/template'

class MakeTemplateRepository {
	private constructor() {}

	public static execute(): TemplateRepository {
		return TemplateRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeTemplateRepository.execute()
