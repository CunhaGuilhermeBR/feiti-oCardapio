import { logger } from '@/infrastructure/logger'
import { PrismaClient, ConfigPageType, ConfigSpeckResult } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class ConfigSpeckResultRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: ConfigSpeckResultRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new ConfigSpeckResultRepository(
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

	public async findById(id:number) {
		const cacheKey = `configSpeckResult:${id}`

		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.configSpeckResult.findUnique({
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

	public async findAll(appId?: number) {
        const cacheKey = appId ? `configSpeckResults:${appId}` : 'configSpeckResults:all';
    
        const cachedData = await this.redisClient.get(cacheKey);
    
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    
        const result = await this.prisma.configSpeckResult.findMany({
            where: appId ? {
                ConfigurableItem: {
                    applicationId: appId
                }
            } : {}
        });
    
        // avoid caching null results
        if (result.length > 0) {
            await this.redisClient.set(cacheKey, JSON.stringify(result));
            await this.redisClient.expire(cacheKey, 3600);
        }
    
        return result;
    }    

	public async create(data: Partial<ConfigSpeckResult>): Promise<ConfigSpeckResult> {
		const result = await this.prisma.configSpeckResult.create({
			data: {
				speckApiToken: data.speckApiToken!,
				speckOrigin: data.speckOrigin!,
				speckUrl: data.speckUrl!,
                itemId: data.itemId!
			},
		})


		return result
	}

	public async update(data: Partial<ConfigSpeckResult>, id: number) {
		const result = await this.prisma.configSpeckResult.update({
			where: {
				id: id
			},
			data
		})

		const cachedKey = `configSpeckResult:${id}`

		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}
		return result
	}

	public async delete(id: number) {
		const result = await this.prisma.configSpeckResult.delete({
			where: {
				id: id
			}
		})

		const cachedKey = `configSpeckResult:${id}`

		this.redisClient.del(cachedKey)

		return result
	}
}