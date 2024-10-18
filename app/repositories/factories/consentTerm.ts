import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { ConsentTermRepository } from '@/repositories/acceptTCLEFields'

class MakeConsentTermRepository {
	private constructor() {}

	public static execute(): ConsentTermRepository {
		return ConsentTermRepository.getInstance(prisma)
	}
}

export default MakeConsentTermRepository.execute()
