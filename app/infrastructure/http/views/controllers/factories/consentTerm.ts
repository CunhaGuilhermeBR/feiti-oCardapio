import { Application } from 'express'
import Services from '@/services'
import { ConsentTermController } from './../configConsentTerm'

class MakeConsentTermController {
	private constructor() {}

	public static execute(application: Application): ConsentTermController {
		return ConsentTermController.getInstance(
			application,
			Services.ConfigurableItem,
		)
	}
}

export default MakeConsentTermController
