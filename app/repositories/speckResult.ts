import { PrismaClient, SpeckResult } from '@prisma/client'
import { RedisConnection } from 'redis-om'


export class SpeckResultRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: SpeckResultRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new SpeckResultRepository(
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

	public async create(data: any): Promise<SpeckResult> {
		const result = await this.prisma.speckResult.create({
			data: {
				interviewId: data.interviewId,
				pdfReportFile: data.pdfReportFile,
				configSpeckResultId: data.configSpeckResultId
			},
		})

		const cacheKeys = [
			`speckResult:${result.id}`,
			`speckResult:interview:${result.interviewId}`
		]

		cacheKeys.forEach(async (cacheKey) => {
			// avoid caching null results
			if (result) {
				this.redisClient.set(cacheKey, JSON.stringify(result))
				this.redisClient.expire(cacheKey, 600)
			}
		})

		return result
	}

	public async findById(id: number): Promise<SpeckResult | null> {
		const cacheKeys = [
			`speckResult:${id}`
		]
		const cachedData = await this.redisClient.get(cacheKeys[0])

		if (cachedData) {
			return JSON.parse(cachedData) as SpeckResult
		}

		const result = await this.prisma.speckResult.findUnique({
			where: {
				id: id,
			},
		})

		

		if (result) {
			cacheKeys.push(`speckResult:interview:${result.interviewId}`)
			cacheKeys.forEach(async (cacheKey) => {
				// avoid caching null results
				if (result) {
					this.redisClient.set(cacheKey, JSON.stringify(result))
					this.redisClient.expire(cacheKey, 600)
				}
			})
		}

		return result
	}

	public async findByInterview(interviewId: string){
		const cacheKey = `speckResult:interview:${interviewId}`

		const cachedData = await this.redisClient.get(cacheKey)
		if (cachedData) {
			return JSON.parse(cachedData) as SpeckResult
		}

		const result = await this.prisma.speckResult.findFirst({
			where: {
				interviewId
			}
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 600) // 10 minutes
		}

		return result
	}
}