import { PrismaClient, Template } from '@prisma/client'
import { RedisConnection } from 'redis-om'

export class TemplateRepository {
	private prisma: PrismaClient
	private redisClient: RedisConnection

	private static instance: TemplateRepository

	public static getInstance(
		prisma: PrismaClient,
		redisClient: RedisConnection
	) {
		if (!this.instance) {
			this.instance = new TemplateRepository(
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

	public async create(data: Partial<Template>): Promise<Template> {
		return await this.prisma.template.create({
			data: {
				id: data.id!,
				title: data.title!,
				vocational: data.vocational,
				configTCLEId: data.configTCLEId!
			}
		})
	}

	public async update(data: Partial<Template>, id: string): Promise<Template> {
		return await this.prisma.template.update({
			where: { id },
			data
		})
	}

	public async findAll(): Promise<Template[]>{
		return await this.prisma.template.findMany()
	}

	public async delete(id: string) {
		return await this.prisma.template.delete({
			where: { id }
		})
	}

	public async findByName(
		name: string,
		appUrl: string
	): Promise<Template | null> {
		const cacheKey = `template:${appUrl}:${name}`
		const cachedData = await this.redisClient.get(cacheKey)

		if (cachedData) {
			return JSON.parse(cachedData) as Template
		}

		const result = await this.prisma.template.findUnique({
			where: {
				title: name,
				configTCLE: {
					ConfigurableItem: {
						Application: {
							url: appUrl,
						},
					},
				},
			},
		})

		// avoid caching null results
		if (result) {
			this.redisClient.set(cacheKey, JSON.stringify(result))
			this.redisClient.expire(cacheKey, 3600)
		}

		return result
	}

	public async findConfigConsertTermByTemplateID(
		saleId: string,
		appUrl: string
	) {
		return this.prisma.sale.findUnique({
			where: {
				id: saleId,
				Application: {
					url: appUrl,
				},
			},
			select: {
				Interview: {
					select: {
						Template: {
							select: {
								configTCLE: {
									select: {
										ConfigurableItem: {
											select: {
												title: true,
												description: true,
												ConfigConsentTerm: {
													select: {
														ConfigConsentTermCheckFields: {
															select: {
																id: true,
																ConfigurableItem: {
																	select: {
																		title: true,
																		description: true,
																	},
																}
															}
														},
													}
												}
											},
										},
									}
								}
							},
						}
					}
				}
			}
		})
	}
}
