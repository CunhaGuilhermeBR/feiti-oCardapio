import { ConfigurableItemService } from '@/services/configurableItem'
import RepositoryFactory from '@/repositories'

class MakeConfigurableItemService {
	private constructor() {}

	public static execute(): ConfigurableItemService {
		return ConfigurableItemService.getInstance(
			RepositoryFactory.Application,
			RepositoryFactory.ConfigurableItem
		)
	}
}

export default MakeConfigurableItemService.execute()
