import { ProductService } from '@/services/product'
import { CategoryService } from '../category'

interface ServiceFactory {
  Category: CategoryService;
  Product: ProductService;
}

export default ServiceFactory
