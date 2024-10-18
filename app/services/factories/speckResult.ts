import RepositoryFactory from '@/repositories'
import { SpeckResultService } from '@/services/speckResult'

class MakeSpeckResultService {
	private constructor() { }

	public static execute(): SpeckResultService {
		return SpeckResultService.getInstance(
			RepositoryFactory.SpeckResult)
	}
}

export default MakeSpeckResultService.execute()
