import { AuthenticationController } from '../authentication'

interface IControllerFactory {
	Authentication: AuthenticationController
	
}

export default IControllerFactory
