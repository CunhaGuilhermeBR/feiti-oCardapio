import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { EmailRepository } from '@/repositories/email'

class MakeEmailRepository {
	private constructor() {}

	public static execute(): EmailRepository {
		return EmailRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeEmailRepository.execute()
