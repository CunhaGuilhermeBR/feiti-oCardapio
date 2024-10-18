import RepositoryFactory from '@/repositories'
import { ConfigSpeckResultService } from '../configSpeckResult'

class MakeConfigSpeckResultService {
	private constructor() {}

	public static execute(): ConfigSpeckResultService {
		return ConfigSpeckResultService.getInstance(
            RepositoryFactory.ConfigSpeckResult,
			RepositoryFactory.ConfigurableItem,
            RepositoryFactory.Application,
		)
	}
}

export default MakeConfigSpeckResultService.execute()
