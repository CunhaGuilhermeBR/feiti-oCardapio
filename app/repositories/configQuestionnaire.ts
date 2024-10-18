import { logger } from '@/infrastructure/logger'
import { PrismaClient } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class ConfigQuestionnaireRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: ConfigQuestionnaireRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new ConfigQuestionnaireRepository(
				prisma,
				redisClient
			)
		}
		return this.instance
	}

	private constructor(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		this.prisma = prisma
		this.redisClient = redisClient
	}

	public async findById(id: number) {
		const cacheKey = `configQuestionnaire:${id}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.configQuestionnaire.findUnique({
			where: {
				id: id,
			},
			include: {
				ConfigurableItem: true
			}
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}


		return result
	}

	public async update(data: any, id: number) {
		const cacheKey = `configQuestionnaire:${id}`

		const result = await this.prisma.configQuestionnaire.update({
			where: {
				id: id
			},
			data
		})
		
		this.redisClient.del(cacheKey)

		return result
	}

	public async delete(id: number) {
		const cacheKey = `configQuestionnaire:${id}`

		const result = await this.prisma.configQuestionnaire.delete({
			where: {
				id: id
			}
		})

		this.redisClient.del(cacheKey)

		return result
	}
}
