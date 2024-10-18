import { PrismaClient } from '@prisma/client'

export class RecommendationRepository {
	private prisma: PrismaClient

	private static instance: RecommendationRepository

	public static getInstance(prisma: PrismaClient) {
		if (!this.instance) {
			this.instance = new RecommendationRepository(prisma)
		}
		return this.instance
	}

	private constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public async create(courseName: string, interviewId: string) {
		return await this.prisma.recommendation.create({
			data: {
				courseName,
				interviewId
			}
		})
	}

	public async findManyByInterviewId(interviewId: string) {
		return await this.prisma.recommendation.findMany({
			where: {
				interviewId
			},
			orderBy: {
				courseName : 'asc'
			}
		})
	}
}
