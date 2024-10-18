import RepositoryFactory from '@/repositories'
import { ConsentTermService } from '../consentTerm'

class MakeConsentTermService {
	private constructor() {}

	public static execute(): ConsentTermService {
		return ConsentTermService.getInstance(
			RepositoryFactory.ConsentTerm,
			RepositoryFactory.Template,
			RepositoryFactory.ConfigurableItem,
			RepositoryFactory.ConfigTCLE,
			RepositoryFactory.ConfigTCLEField
		)
	}
}

export default MakeConsentTermService.execute()
