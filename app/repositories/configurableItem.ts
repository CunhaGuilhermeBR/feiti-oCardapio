import { logger } from '@/infrastructure/logger'
import { PrismaClient, ConfigurableItem, ConfigPageType } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class ConfigurableItemRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: ConfigurableItemRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new ConfigurableItemRepository(
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

	public async findOne(
		pageType: ConfigPageType,
		url: string
	) {
		/* TODO:
		* Devemos verificar a seguinte condição:
		* Dentro de uma mesma aplicação (appId) pode
		* existir mais de uma pagina de mesmo tipo?
		* Acredito que não, devemos mudar o banco.
		*/
		const cacheKey = `configurableItem:${pageType}:${url}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.configurableItem.findFirst({
			where: {
				configPageType: pageType,
				enabled: true,
				Application: {
					url: url,
					enabled: true
				}
			},
			select: {
				id: true,
				title: true,
				imageUrl: true,
				description: true,
				ConfigSpeckResult: true,
				Application: {
					select:{
						name: true,
						imageurl: true,
					}
				},
				ConfigurableItemLabels: {
					select: {
						key: true,
						value: true
					}
				}
			}
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}


		return result
	}

	public async findById(id:number) {
		const cacheKey = `configurableItem:${id}`

		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.configurableItem.findUnique({
			where: {
				id
			}
		})
		
		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}


		return result
	}

	public async findAll(url: string) {
		const cacheKey = `configurableItem:${url}`

		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.configurableItem.findMany({
			where: {
				Application: {
					url: url
				}
			}
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}


		return result
	}

	public async create(data: Partial<ConfigurableItem>): Promise<ConfigurableItem> {
		const cacheKeys = [
			`configurableItem:${data.applicationId}`,
			`configurableItem:${data.configPageType}:${data.applicationId}`
		]
		const result = await this.prisma.configurableItem.create({
			data: {
				title: data.title!,
				description: data.description!,
				applicationId: data.applicationId!,
				configPageType: data.configPageType,
				index: data.index,
				imageUrl: data.imageUrl,
				enabled: true
			},
		})

		cacheKeys.forEach(async (cacheKey) => {
			this.redisClient.del(cacheKey)
		})

		return result
	}

	public async update(data: Partial<ConfigurableItem>, id: number) {
		const result = await this.prisma.configurableItem.update({
			where: {
				id: id
			},
			data
		})

		const cacheKeys = [
			`configurableItem:${id}`,
			`configurableItem:${result.applicationId}`,
			`configurableItem:${result.configPageType}:${result.applicationId}`
		]

		cacheKeys.forEach(async (cacheKey) => {
			this.redisClient.del(cacheKey)
		})

		return result
	}

	public async delete(id: number) {
		const result = await this.prisma.configurableItem.delete({
			where: {
				id: id
			}
		})

		const cacheKeys = [
			`configurableItem:${id}`,
			`configurableItem:${result.applicationId}`,
			`configurableItem:${result.configPageType}:${result.applicationId}`
		]

		cacheKeys.forEach(async (cacheKey) => {
			this.redisClient.del(cacheKey)
		})

		return result
	}
}