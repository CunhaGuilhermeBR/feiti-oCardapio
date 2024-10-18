import { PrismaClient, ApplicationEmail } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class EmailRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: EmailRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new EmailRepository(
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

	public async create(data: Partial<ApplicationEmail>): Promise<ApplicationEmail> {
		const result = await this.prisma.applicationEmail.create({
			data: {
				email: data.email!,
				emailPassword: data.emailPassword!,
				applicationId: data.applicationId!,
				domain: data.domain!,
				host: data.host!,
				port: data.port!
			},
		})

		const cachedKey = `applicationEmail:applicationId:${data.applicationId}`
		this.redisClient.del(cachedKey)

		return result
	}

	public async findByApplication(applicationId?: number, applicationUrl?: string) {
		if (!applicationId && !applicationUrl) {
			return null
		}

		const cachedKey = `applicationEmail:applicationId:${applicationId}`
		const cachedData = await this.redisClient.get(cachedKey)

		if (cachedData) {
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.applicationEmail.findFirst({
			where: {
				applicationId: applicationId,
				Application: {
					url: applicationUrl
				}
			},
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}

		return result
	}


	public async update(data: Partial<ApplicationEmail>, id: number) {
		const result = await this.prisma.applicationEmail.update({
			where: {
				id
			},
			data
		})

		const cachedKey = `applicationEmail:applicationId:${result.applicationId}`
		this.redisClient.del(cachedKey)

		return result
	}

	public async delete(id: number) {
		const result = await this.prisma.applicationEmail.delete({
			where: {
				id
			}
		})

		const cachedKey = `applicationEmail:applicationId:${result.applicationId}`
		this.redisClient.del(cachedKey)

		return result
	}

	public async findOne(id: number) {
		return await this.prisma.applicationEmail.findUnique({
			where: { id }
		})
	}
}
