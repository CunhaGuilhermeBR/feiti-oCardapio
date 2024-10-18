import { Application } from 'express'
import { AuthenticationController } from '../authentication'
import Services from '@/services'

class MakeAuthenticationController {
	private constructor() { }

	public static execute(application: Application): AuthenticationController {
		return AuthenticationController.getInstance(
			application,
			Services.Sale
		)
	}
}

export default MakeAuthenticationController
