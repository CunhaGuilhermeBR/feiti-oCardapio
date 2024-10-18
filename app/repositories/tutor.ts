import { PrismaClient, Tutor } from '@prisma/client'

export class TutorRepository {
	private prisma: PrismaClient

	private static instance: TutorRepository

	public static getInstance(
		prisma: PrismaClient,
	) {
		if (!this.instance) {
			this.instance = new TutorRepository(
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

	public async create(data: Partial<Tutor>): Promise<Tutor> {
		return await this.prisma.tutor.create({
			data: {
				email: data.email!,
				password: data.password!,
				firstLogin: true
			}
		})
	}

	public async findAll() {
		return await this.prisma.tutor.findMany()
	}

	public async findByEmail(email: string) {
		return await this.prisma.tutor.findUnique({
			where: { email }
		})
	}


	public async update(id: string, data: Partial<Tutor>) {
		return await this.prisma.tutor.update({
			where: {
				id
			},
			data
		})
	}

	public async delete(id: string){
		return await this.prisma.tutor.delete({
			where: {
				id
			}
		})
	}
}
