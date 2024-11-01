import MakeProductRepository from './product'
import MakeCategoryRepository from './category'
import IRepositoryFactory from './types'

const RepositoryFactory: IRepositoryFactory = {
	Category: MakeCategoryRepository,
	Product: MakeProductRepository
}

export default RepositoryFactory
