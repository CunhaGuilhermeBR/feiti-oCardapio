import { CategoryRepository } from '@/repositories/category'
import { CategoryDTO, UpdateCategoryDTO } from './types'

export class CategoryService {
	private categoryRepository: CategoryRepository
	private static instance: CategoryService

	public static getInstance(
		categoryRepository: CategoryRepository) {
		if (!this.instance) {
			this.instance = new CategoryService(categoryRepository)
		}
		return this.instance
	}

	private constructor(
		categoryRepository: CategoryRepository) {
		this.categoryRepository = categoryRepository
	}

	public async delete(id:string){
		return await this.categoryRepository.delete(id)
	}

	public async create(data: CategoryDTO){
		return await this.categoryRepository.create(data)
	}

	public async update(data: UpdateCategoryDTO, id: string){
		return await this.categoryRepository.update(data, id)
	}

	public async findAll(){
		return await this.categoryRepository.findAll()
	}

	public async getAllByCategorie(){
		return await this.categoryRepository.getActiveProductsGroupedByCategory()
	}

}
