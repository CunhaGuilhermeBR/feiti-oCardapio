import { $Enums, Application, Interview, PrismaClient, Sale } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class SaleRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: SaleRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new SaleRepository(
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

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	public async create(data: any): Promise<Sale> {
		const result = await this.prisma.sale.create({
			data: {
				email: data.email,
				customerName: data.name,
				externalId: data.externalId,
				source: data.source,
				applicationId: data.applicationId,
			},
		})

		const cacheKey = `sale:${result.id}`
		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async findById(id: string): Promise<Sale | null> {
		const cacheKey = `sale:${id}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			return JSON.parse(cachedData) as Sale
		}

		const result = await this.prisma.sale.findUnique({
			where: {
				id: id,
			},
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 600) // 10 minutes
		}

		return result
	}

	public async findByExternalId(externalId: string): Promise<Sale & {
		Application: Application;
		Interview: Interview[];
	} | null> {
		const cacheKey = `saleExternalId:${externalId}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			return JSON.parse(cachedData)
		}


		const result = await this.prisma.sale.findFirst({
			where: {
				externalId: externalId,
			},
			include: {
				Interview: true,
				Application: true,
			}

		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 600) // 10 minutes
		}

		return result
	}

	public async findBySource(source: $Enums.SaleSource): Promise<Sale[] | null> {
		const result = await this.prisma.sale.findMany({
			where: {
				source: source,
			},
		})
		return result
	}
}
