import { PrismaClient, Product } from '@prisma/client'


export class ProductRepository {
	private prisma: PrismaClient

	private static instance: ProductRepository

	public static getInstance(
		prisma: PrismaClient) {
		if (!this.instance) {
			this.instance = new ProductRepository(prisma)
		}
		return this.instance
	}

	private constructor(
		prisma: PrismaClient
	) {
		this.prisma = prisma
	}

	public async findAll() {
		return await this.prisma.product.findMany()
	}


	public async create(data: Partial<Product>) {
		const result = await this.prisma.product.create({
			data: {
				name: data.name!,
				description: data.description!,
				price: data.price!,
				options: data.options,
				categoryId: data.categoryId!,
				active: data.active || true
			}
		})

		return result
	}

	public async update(data: Partial<Product>, id: string) {


		const result = await this.prisma.product.update({
			where: {
				id
			},
			data
		})

		return result
	}

	public async delete (id: string) {

		const result = await this.prisma.product.delete({
			where: {
				id
			}
		})

		return result
	}
}
