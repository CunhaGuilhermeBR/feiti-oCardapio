import { Application } from 'express'
import { AuthenticationController } from '../authentication'

class MakeAuthenticationController {
	private constructor() { }

	public static execute(application: Application): AuthenticationController {
		return AuthenticationController.getInstance(
			application
		)
	}
}

export default MakeAuthenticationController
