import { PrismaClient, Interview } from '@prisma/client'

export class InterviewRepository {
	private prisma: PrismaClient

	private static instance: InterviewRepository

	public static getInstance(
		prisma: PrismaClient,
	) {
		if (!this.instance) {
			this.instance = new InterviewRepository(
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

	public async create(data: Partial<Interview>): Promise<Interview> {
		const result = await this.prisma.interview.create({
			data: {
				saleId: data.saleId!,
				templateId: data.templateId!,
			},
		})
		return result
	}

	public async findById(id: string) {
		const result = await this.prisma.interview.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				saleId: true,
				Template: {
					select :{
						id: true,
						vocational: true,
						title: true
					},
				},
				responded: true,
				Sale: {
					select: {
						customerName : true,
						email: true,
						externalId: true,
						source: true,
						Application: {
							select: {
								url: true,
								id: true
							}
						}
					},
				},
			},
		})

		return result
	}

	public async update(id: string, data: Partial<Interview>) {
		const result = await this.prisma.interview.update({
			where: {
				id,
			},
			data,
		})
		return result
	}
}
