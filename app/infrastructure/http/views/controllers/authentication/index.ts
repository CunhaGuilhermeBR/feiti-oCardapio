import { Application, NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'


export class AuthenticationController {
	private application: Application
	private router: Router

	private static instance: AuthenticationController

	static getInstance(
		application: Application,
	) {
		if (!AuthenticationController.instance) {
			AuthenticationController.instance = new AuthenticationController(
				application
			)
		}
		return AuthenticationController.instance
	}

	private constructor(
		application: Application,
	) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.application = application
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/speck-store', this.router)
	}

	
	private setupRoutes() {
		
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}

export default AuthenticationController.getInstance
