import { ProductService } from './product'
import { CategoryService } from './category'

interface Services {
  CategoryService: CategoryService
  ProductService: ProductService,

}

export default Services
