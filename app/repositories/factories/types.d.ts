import { ProductRepository } from '@/repositories/product'
import { CategoryRepository } from '../category'

interface IRepositoryFactory {
  Category: CategoryRepository;
  Product: ProductRepository;
  
}

export default IRepositoryFactory
