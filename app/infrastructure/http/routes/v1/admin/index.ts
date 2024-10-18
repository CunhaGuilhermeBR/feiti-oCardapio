import Services from '@/services'
import { Router } from 'express'
import EmailRouter from './email'

class AdminRouter {
	private AdminRouter: Router

	private static instance: AdminRouter

	static getInstance() {
		if (!AdminRouter.instance) {
			AdminRouter.instance = new AdminRouter()
		}
		return AdminRouter.instance
	}

	private constructor() {
		this.AdminRouter = Router()
		this.setupMiddlewares()
		this.setupRoutes()
	}

	private setupRoutes() {
		this.AdminRouter.use(
			'/email', 
			EmailRouter(
				Services.Sale
			).getRouter()
		)
	}


	private setupMiddlewares() { }

	getRouter() {
		return this.AdminRouter
	}
}

export default AdminRouter.getInstance()
