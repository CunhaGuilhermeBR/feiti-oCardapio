import RepositoryFactory from '@/repositories'
import { SaleService } from '@/services/sale'
import MakeEmailService from './email'

class MakeSaleService {
	private constructor() {}

	public static execute(): SaleService {
		return SaleService.getInstance(
			RepositoryFactory.Application,
			RepositoryFactory.Interview,
			RepositoryFactory.Template,
			RepositoryFactory.Sale,
			MakeEmailService,
			RepositoryFactory.ConsentTerm,
		)
	}
}

export default MakeSaleService.execute()
