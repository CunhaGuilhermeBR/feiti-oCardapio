import { Application } from 'express'
import Services from '@/services'
import { ConfigurableItemController } from './../configurableItem'

class MakeConfigurableItemController {
	private constructor() {}

	public static execute(application: Application): ConfigurableItemController {
		return ConfigurableItemController.getInstance(
			application,
			Services.ConfigurableItem,
			Services.Interview
		)
	}
}

export default MakeConfigurableItemController
