import { PrismaClient, InterviewQuestion } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class InterviewQuestionRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: InterviewQuestionRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new InterviewQuestionRepository(
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

	public async findAllByQuestionnaire(questionnaireId: number) {
		const cacheKey = `interviewQuestionsByQuestionnaire:${questionnaireId}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.interviewQuestion.findMany({
			where: {
				questionnaireId
			},
			orderBy: {
				index: 'asc'
			},
			include: {
				ConfigQuestion: true
			}
		})

		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async create(data: Partial<InterviewQuestion>): Promise<InterviewQuestion> {
		const result = await this.prisma.interviewQuestion.create({
			data: {
				index: data.index!,
				questionnaireId: data.questionnaireId!,
				question: data.question!,
				configQuestionId: data.configQuestionId!
			},
		})

		const cacheKey = `interviewQuestion:${result.questionnaireId}:${result.index}`

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async findById(index: number, questionnaireId: number) {
		const cacheKey = `interviewQuestion:${questionnaireId}:${index}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			return JSON.parse(cachedData)
		}

		const result = await this.prisma.interviewQuestion.findUnique({
			where: {
				questionnaireId_index: { questionnaireId, index }
			},
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async update(data: Partial<InterviewQuestion>, index: number, questionnaireId: number) {
		const cacheKey = `interviewQuestion:${questionnaireId}:${index}`

		const result = await this.prisma.interviewQuestion.update({
			where: {
				questionnaireId_index: { questionnaireId, index }
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

	public async delete(index: number, questionnaireId: number) {
		const cacheKey = `interviewQuestion:${questionnaireId}:${index}`
		const result = await this.prisma.interviewQuestion.delete({
			where: {
				questionnaireId_index: { questionnaireId, index }
			}
		})

		this.redisClient.del(cacheKey)

		return result
	}
}
