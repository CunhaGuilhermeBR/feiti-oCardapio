import { logger } from '@/infrastructure/logger'
import { PrismaClient, Application } from '@prisma/client'
import { RedisConnection } from 'redis-om'


export class ApplicationRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: ApplicationRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new ApplicationRepository(
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

	public async findOneByURL(url: string): Promise<Application | null> {
		const cacheKey = `application:${url}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData) as Application
		}

		const result = await this.prisma.application.findFirst({
			where: {
				url: url,
				enabled: true,
			},
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async findOneById(id: number): Promise<Application | null> {
		const cacheKey = `application:${id}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData) as Application
		}

		const result = await this.prisma.application.findFirst({
			where: {
				id: id,
				enabled: true,
			},
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async findAll() {
		return await this.prisma.application.findMany({
			select: {
				url: true,
				name: true,
				imageurl: true,
				enabled: true,
				id: true
			}
		})
	}

	public async create(data: Partial<Application>) {
		const result = await this.prisma.application.create({
			data: {
				url: data.url!,
				name: data.name!,
				imageurl: data.imageurl!,
				enabled: data.enabled
			}
		})

		// avoid caching null results
		if (result) {
			const cacheKey = `application:${result.id}`
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async update(data: Partial<Application>, id: number) {
		const cacheKey = `application:${id}`

		const result = await this.prisma.application.update({
			where: {
				id
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
		const cacheKey = `application:${id}`
		const result = await this.prisma.application.delete({
			where: {
				id
			}
		})

		this.redisClient.del(cacheKey)

		return result
	}
}
