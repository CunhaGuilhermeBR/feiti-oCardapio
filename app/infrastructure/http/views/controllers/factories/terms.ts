import { Application } from 'express'
import Services from '@/services'
import { TermsController } from '../terms'

class MakeTermsController {
	private constructor() {}

	public static execute(application: Application): TermsController {
		return TermsController.getInstance(
			application,
			Services.ConsentTerm,
			Services.Sale
		)
	}
}

export default MakeTermsController
