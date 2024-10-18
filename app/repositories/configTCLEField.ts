import { ConfigConsentTermCheckFields, PrismaClient } from '@prisma/client'

export class ConfigTCLEFieldRepository {
	private prisma: PrismaClient

	private static instance: ConfigTCLEFieldRepository

	public static getInstance(
		prisma: PrismaClient,
	) {
		if (!this.instance) {
			this.instance = new ConfigTCLEFieldRepository(prisma)
		}
		return this.instance
	}

	private constructor(
		prisma: PrismaClient,
	) {
		this.prisma = prisma
	}

	public async create(data: Partial<ConfigConsentTermCheckFields>) {
		return await this.prisma.configConsentTermCheckFields.create({
			data: {
				itemId: data.itemId!,
                consentTermId: data.consentTermId!
			}
		})
	}

	public async update(data: Partial<ConfigConsentTermCheckFields>, id: number) {
		return await this.prisma.configConsentTermCheckFields.update({
			where: { id },
			data
		})
	}

	public async delete(id: number) {
		return await this.prisma.configConsentTermCheckFields.delete({
			where: { id }
		})
	}

	public async findAll(){
		return await this.prisma.configConsentTermCheckFields.findMany({
			include: {
				ConfigurableItem: true
			}
		})
	}

}
