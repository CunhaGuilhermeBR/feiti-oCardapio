import RepositoryFactory from '@/repositories'
import { CategoryService } from '../category'

class MakeCategoryService {
	private constructor() {}

	public static execute(): CategoryService {
		return CategoryService.getInstance(
			RepositoryFactory.Category
		)
	}
}

export default MakeCategoryService.execute()
