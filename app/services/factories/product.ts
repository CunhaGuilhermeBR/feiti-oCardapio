import RepositoryFactory from '@/repositories'
import { ProductService } from '../product'

class MakeProductService {
	private constructor() {}

	public static execute(): ProductService {
		return ProductService.getInstance(
			RepositoryFactory.Product
		)
	}
}

export default MakeProductService.execute()
