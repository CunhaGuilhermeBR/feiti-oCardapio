import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { ConfigTCLERepository } from '@/repositories/configTCLE'

class MakeConfigTCLERepository {
	private constructor() {}

	public static execute(): ConfigTCLERepository {
		return ConfigTCLERepository.getInstance(prisma)
	}
}

export default MakeConfigTCLERepository.execute()
