import RepositoryFactory from './factories'
import Repositories from './types'

const Repositories: Repositories = {
	Category: RepositoryFactory.Category,
	Product: RepositoryFactory.Product,
}

export default Repositories
