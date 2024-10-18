import { logger } from '@/infrastructure/logger'
import { PrismaClient } from '@prisma/client'

class PrismaClientSingleton {
	static instance: PrismaClient

	static getInstance() {
		if (!PrismaClientSingleton.instance) {
			PrismaClientSingleton.instance = new PrismaClient({
				log: process.env.NODE_ENV === 'development' ? ['query'] : [],
			})
		}

		PrismaClientSingleton.instance
			.$connect()
			.then(() => {
				logger.info('Database connection established')
			})
			.catch((error) => {
				logger.error('Database connection error: ' + error)
			})

		return PrismaClientSingleton.instance
	}
}

export const prisma = PrismaClientSingleton.getInstance()
