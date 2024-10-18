import RepositoryFactory from '@/repositories'
import { ApplicationService } from '../application'

class MakeApplicationService {
	private constructor() {}

	public static execute(): ApplicationService {
		return ApplicationService.getInstance(
            RepositoryFactory.Application
		)
	}
}

export default MakeApplicationService.execute()
