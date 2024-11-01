import { CategoryRepository } from './category'
import { ProductRepository } from './product'

interface Repositories {
  Category: CategoryRepository;
  Product: ProductRepository;
}

export default Repositories
