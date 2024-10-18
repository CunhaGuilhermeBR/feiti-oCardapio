import { PrismaClient, InterviewQuestionnaire } from '@prisma/client'
import { RedisConnection } from 'redis-om'
import { logger } from '@/infrastructure/logger'

export class InterviewQuestionnaireRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: InterviewQuestionnaireRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new InterviewQuestionnaireRepository(
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

	public async create(data: Partial<InterviewQuestionnaire>): Promise<InterviewQuestionnaire> {
		const result = await this.prisma.interviewQuestionnaire.create({
			data: {
				configQuestionnaireId: data.configQuestionnaireId!,
			},
		})

		return result
	}

	public async getAllByApplicationUrl(url: string) {
		const cacheKey = `interviewQuestionnaireURL:${url}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.interviewQuestionnaire.findMany({
			where: {
				ConfigQuestionnaire: {
					ConfigurableItem: {
						Application: {
							url: url
						}
					}
				}
			},
			include: {
				InterviewQuestions: true,
				ConfigQuestionnaire: {
					include: {
						ConfigurableItem: true
					}
				}
			}
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}
		return result
	}

	public async findById(id: number) {
		const cacheKey = `interviewQuestionnaire:${id}`

		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			logger.info(`Cache hit for ${cacheKey}`)
			return JSON.parse(cachedData)
		}


		const result = await this.prisma.interviewQuestionnaire.findUnique({
			where: {
				id: id,
			},
			include: {
				InterviewQuestions: {
					include: {
						ConfigQuestion: true
					},
					orderBy: {
						index: 'asc'
					}
				},
				ConfigQuestionnaire: {
					include: {
						ConfigurableItem: true
					}

				}
			},
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async update(data: Partial<InterviewQuestionnaire>, id: number) {
		const result = await this.prisma.interviewQuestionnaire.update({
			where: {
				id: id
			},
			data
		})

		const cachedKey = `interviewQuestionnaire:configQuestionnaire:${id}`

		// avoid caching null results
		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}

		return result
	}

	public async delete(id: number) {
		const result = await this.prisma.interviewQuestionnaire.delete({
			where: {
				id: id
			}
		})

		const cachedKey = `interviewQuestionnaire:configQuestionnaire:${id}`

		// avoid caching null results
		if (result) {
			this.redisClient.set(cachedKey, JSON.stringify(result))
			this.redisClient.expire(cachedKey, 3600)
		}

		return result
	}
}
