import { ProductRepository } from '@/repositories/product'
import { ProductDTO, UpdateProductDTO } from './types'

export class ProductService {
	private productRepository: ProductRepository
	private static instance: ProductService

	public static getInstance(
		productRepository: ProductRepository) {
		if (!this.instance) {
			this.instance = new ProductService(productRepository)
		}
		return this.instance
	}

	private constructor(
		productRepository: ProductRepository) {
		this.productRepository = productRepository
	}

	public async delete(id:string){
		return await this.productRepository.delete(id)
	}

	public async create(data: ProductDTO){
		return await this.productRepository.create(data)
	}

	public async update(data: UpdateProductDTO, id: string){
		return await this.productRepository.update(data, id)
	}

	public async findAll(){
		return await this.productRepository.findAll()
	}

}
