import { Application } from 'express'
import IControllerFactory from './types'
import MakeAuthenticationController from './authentication'


function ControllerFactory(application: Application): IControllerFactory {

	const Controllers: IControllerFactory = {
		Authentication: MakeAuthenticationController.execute(application),
		
	}
	return Controllers
}

export default ControllerFactory
