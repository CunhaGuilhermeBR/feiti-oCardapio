import { PrismaClient, AcceptTCLEField } from '@prisma/client'

export class ConsentTermRepository {
	private prisma: PrismaClient

	private static instance: ConsentTermRepository

	public static getInstance(prisma: PrismaClient) {
		if (!this.instance) {
			this.instance = new ConsentTermRepository(prisma)
		}
		return this.instance
	}

	private constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public async findById(id: number) {
		return await this.prisma.configConsentTerm.findUniqueOrThrow({
			where: {
				id
			},
			include: {
				ConfigConsentTermCheckFields: {
					include: {
						ConfigurableItem: true
					}
				}
			}
		})
	}

	public async create(data: Partial<AcceptTCLEField>): Promise<AcceptTCLEField | null> {
		return await this.prisma.acceptTCLEField.create({
			data: {
				saleId: data.saleId!,
				accept: true,
				ConfigConsentTermCheckFieldsId: data.ConfigConsentTermCheckFieldsId!,
			},
		})
	}

	public async findBySaleId(saleId: string, configConsentTermCheckFieldsId: number) {
		return await this.prisma.acceptTCLEField.findUnique({
			where: {
				saleId_ConfigConsentTermCheckFieldsId: {
					saleId: saleId,
					ConfigConsentTermCheckFieldsId: configConsentTermCheckFieldsId
				}
			}
		})
	}


	public async findAcceptedBySaleIdAndInterviewID(
		saleId: string,
		interviewID: string
	) {
		return await this.prisma.acceptTCLEField.findMany({
			where: {
				saleId: saleId,
				accept: true,
				Sale: {
					Interview: {
						some: {
							id: interviewID,
						},
					},
				},
			},
			select: {
				accept: true,
				ConfigConsentTermCheckFields: {
					select: {
						ConfigConsentTerm: {
							select: {
								id: true,
							},
						},
					},
				},
			},
		})
	}

	public async findShouldBeAcceptedByConfigConsentTermId(
		configConsentTermId: number
	) {
		return await this.prisma.configConsentTermCheckFields.count({
			where: {
				ConfigConsentTerm: {
					id: configConsentTermId,
				},
			},
		})
	}
}