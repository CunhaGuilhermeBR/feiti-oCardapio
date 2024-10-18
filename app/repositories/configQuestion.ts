import { logger } from '@/infrastructure/logger'
import { ConfigQuestion, PrismaClient } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class ConfigQuestionRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: ConfigQuestionRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {		if (!this.instance) {
		this.instance = new ConfigQuestionRepository(
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
		const cacheKey = `configQuestion_${id}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.configQuestion.findUnique({
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

	public async update(data: Partial<ConfigQuestion>, id: number) {
		const cacheKey = `configQuestion_${id}`
		
		this.redisClient.del(cacheKey)

		const result = await this.prisma.configQuestion.update({
			where: {
				id: id
			},
			data
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async delete(id: number) {
		const cacheKey = `configQuestion_${id}`

		this.redisClient.del(cacheKey)

		const result = await this.prisma.configQuestion.delete({
			where: {
				id: id
			}
		})

		return result
	}
}
