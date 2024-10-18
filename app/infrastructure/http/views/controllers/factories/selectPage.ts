import { Application } from 'express'
import Services from '@/services'
import { SelectPageController } from '../selectName'

class MakeSelectPageController {
	private constructor() {}

	public static execute(application: Application): SelectPageController {
		return SelectPageController.getInstance(
			application,
			Services.ConfigurableItem,
			Services.Interview
		)
	}
}

export default MakeSelectPageController
