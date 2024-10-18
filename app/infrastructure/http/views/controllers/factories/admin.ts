import { Application } from 'express'
import { AdminController } from '../admin'
import Services from '@/services'

class MakeAdminController {
	private constructor() { }

	public static execute(application: Application): AdminController {
		return AdminController.getInstance(
			application,
			Services.Application
		)
	}
}

export default MakeAdminController
