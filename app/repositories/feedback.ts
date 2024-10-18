import { PrismaClient, Feedback, $Enums } from '@prisma/client'

export class FeedbackRepository {
	private prisma: PrismaClient

	private static instance: FeedbackRepository

	public static getInstance(
		prisma: PrismaClient,
	) {
		if (!this.instance) {
			this.instance = new FeedbackRepository(
				prisma
			)
		}
		return this.instance
	}

	private constructor(
		prisma: PrismaClient,
	) {
		this.prisma = prisma
	}

	public async create(data: Partial<Feedback>): Promise<Feedback> {
		const exists = await this.findByTitle(data.saleId!, data.title!)
		if (exists) {
			data.status = $Enums.FeedbackStatus.PENDING
			return await this.update(data.saleId!, data.title!, data)
		}
		return await this.prisma.feedback.create({
			data: {
				content: data.content!,
				title: data.title!,
				saleId: data.saleId!
			}
		})
	}

	public async findAllPending() {
		return await this.prisma.feedback.findMany({
			where: {
				status: 'PENDING'
			}
		})
	}

	public async findByTitle(saleId: string, title: string) {
		return await this.prisma.feedback.findUnique({
			where: {
				saleId_title: { saleId, title }
			},
			include: {
				Sale: {
					select: {
						customerName: true,
						email: true
					}
				}
			}
		})
	}

	public async update(saleId: string, title: string, data: Partial<Feedback>) {
		return await this.prisma.feedback.update({
			where: {
				saleId_title: { saleId, title }
			},
			data
		})
	}
}
