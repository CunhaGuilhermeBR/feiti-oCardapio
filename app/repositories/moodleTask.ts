import { PrismaClient, InterviewQuestionnaire, MoodleTask } from '@prisma/client'
import { RedisConnection } from 'redis-om'
import { logger } from '@/infrastructure/logger'

export class MoodleTaskRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: MoodleTaskRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new MoodleTaskRepository(
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

	public async create(data: Partial<MoodleTask>): Promise<MoodleTask> {
		return await this.prisma.moodleTask.create({ data: {
			name: data.name!,
			prompt: data.prompt!,
			courseName: data.courseName!
		} })
	}

	public async getAll() {
		return await this.prisma.moodleTask.findMany()
	}

	public async findByName(name: string, courseName: string): Promise<MoodleTask | null> {
		const cacheKey = `moodleTask:${courseName}:${name}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}


		const result = await this.prisma.moodleTask.findFirst({
			where: {
				courseName: courseName,
				name: name
			},
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async update(data: Partial<MoodleTask>, id: number) {
		const result = await this.prisma.moodleTask.update({
			where: {
				id
			},
			data
		})

		const cachedKey = `moodleTask:${id}`

		// avoid caching null results
		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}

		return result
	}

	public async delete(id: number) {
		const result = await this.prisma.moodleTask.delete({
			where: {
				id
			}
		})

		const cachedKey = `moodleTask:${id}`

		// avoid caching null results
		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}

		return result
	}
}
