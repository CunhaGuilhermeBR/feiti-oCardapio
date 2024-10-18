import { PrismaClient, MoodleSubmission } from '@prisma/client'
import { RedisConnection } from 'redis-om'
import { logger } from '@/infrastructure/logger'

export class MoodleSubmissionRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: MoodleSubmissionRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new MoodleSubmissionRepository(
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

	public async create(data: Partial<MoodleSubmission>): Promise<MoodleSubmission> {
		return await this.prisma.moodleSubmission.create({ data: {
			id: data.id!,
			content: data.content!,
			moodleTaskId: data.moodleTaskId!,
			saleId: data.saleId!
		} })
	}

	public async getAll() {
		return await this.prisma.moodleSubmission.findMany({
			include: {
				moodleTask: true,
				Sale: {
					include: {
						Application: true
					}
				}
			}
		})
	}

	public async findOne(id: number): Promise<MoodleSubmission | null> {
		const cacheKey = `moodleSubmission:${id}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}


		const result = await this.prisma.moodleSubmission.findUnique({
			where: {
				id
			},
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async update(data: Partial<MoodleSubmission>, id: number) {
		const result = await this.prisma.moodleSubmission.update({
			where: {
				id
			},
			data
		})

		const cachedKey = `moodleSubmission:${id}`

		// avoid caching null results
		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}

		return result
	}

	public async findAllByUser(saleId: string, courseName: string) {
		return await this.prisma.moodleSubmission.findMany({
			where: {
				Sale: {
					id: saleId,
				},
				moodleTask: {
					Course: {
						name: courseName,
					},
				},
			},
			include: {
				moodleTask: true,
				Sale: {
					select: {
						customerName: true,
						externalId: true
					}
				},
			},
			orderBy: {
				moodleTask: {
					name: 'asc',
				},
			},
		})
	}

}
