import { Category, PrismaClient } from '@prisma/client'


export class CategoryRepository {
	private prisma: PrismaClient

	private static instance: CategoryRepository

	public static getInstance(
		prisma: PrismaClient) {
		if (!this.instance) {
			this.instance = new CategoryRepository(prisma)
		}
		return this.instance
	}

	private constructor(
		prisma: PrismaClient
	) {
		this.prisma = prisma
	}

	public async findAll() {
		return await this.prisma.category.findMany()
	}

	public async getActiveProductsGroupedByCategory() {
		const all = await this.prisma.category.findMany()
		const categories = await this.prisma.category.findMany({
			include: {
				products: {
					where: {
						active: true,
					},
				},
			},
		})


		interface GroupedProducts {
			[key: string]: typeof categories[0]['products'];
		}

		const groupedProducts: GroupedProducts = {}

		categories.forEach(category => {
			if (category.products.length > 0) {
				groupedProducts[category.name] = category.products
			}
		})

		return groupedProducts
	}


	public async create(data: Partial<Category>) {
		const result = await this.prisma.category.create({
			data: {
				name: data.name!,
				description: data.description!,
			}
		})

		return result
	}

	public async update(data: Partial<Category>, id: string) {


		const result = await this.prisma.category.update({
			where: {
				id
			},
			data
		})

		return result
	}

	public async delete (id: string) {

		const result = await this.prisma.category.delete({
			where: {
				id
			}
		})

		return result
	}
}
