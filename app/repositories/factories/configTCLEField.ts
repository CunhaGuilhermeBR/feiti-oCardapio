import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { ConfigTCLEFieldRepository } from '@/repositories/configTCLEField'

class MakeConfigTCLEFieldRepository {
	private constructor() {}

	public static execute(): ConfigTCLEFieldRepository {
		return ConfigTCLEFieldRepository.getInstance(prisma)
	}
}

export default MakeConfigTCLEFieldRepository.execute()
