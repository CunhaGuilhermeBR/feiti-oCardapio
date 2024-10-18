import { ConfigConsentTerm, PrismaClient } from '@prisma/client'

export class ConfigTCLERepository {
	private prisma: PrismaClient

	private static instance: ConfigTCLERepository

	public static getInstance(
		prisma: PrismaClient,
	) {
		if (!this.instance) {
			this.instance = new ConfigTCLERepository(prisma)
		}
		return this.instance
	}

	private constructor(
		prisma: PrismaClient,
	) {
		this.prisma = prisma
	}

	public async findByAppId(appId: number) {
		return await this.prisma.configConsentTerm.findFirst({
			where: {
				ConfigurableItem: {
					applicationId: appId,
				},
			}
		});
	}

	public async create(data: Partial<ConfigConsentTerm>) {
		return await this.prisma.configConsentTerm.create({
			data: {
				itemId: data.itemId!
			}
		})
	}

	public async update(data: Partial<ConfigConsentTerm>, id: number) {
		return await this.prisma.configConsentTerm.update({
			where: { id },
			data
		})
	}

	public async delete(id: number) {
		return await this.prisma.configConsentTerm.delete({
			where: { id }
		})
	}

	public async findAll(){
		return await this.prisma.configConsentTerm.findMany({
			include: {
				ConfigurableItem: {
					include: {
						Application: true
					}
				}

			}
		})
	}

}
