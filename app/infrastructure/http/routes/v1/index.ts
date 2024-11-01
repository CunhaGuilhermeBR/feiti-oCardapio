
import Services from '@/services'
import { Router } from 'express'
import ProductRouter from './product'
import CategoryRouter from './category'

class V1Router {
	private V1Router: Router

	private static instance: V1Router

	static getInstance() {
		if (!V1Router.instance) {
			V1Router.instance = new V1Router()
		}
		return V1Router.instance
	}

	private constructor() {
		this.V1Router = Router()
		this.setupMiddlewares()
		this.setupRoutes()
	}

	private setupRoutes() {
		this.setupConfigurableItemRoutes()
	}

	private async setupConfigurableItemRoutes() {
		this.V1Router.use(
			'/product',
			ProductRouter(
				Services.Product
			).getRouter()
		),
		this.V1Router.use(
			'/category',
			CategoryRouter(
				Services.Category
			).getRouter()
		)

	}

	private setupMiddlewares() { }

	getRouter() {
		return this.V1Router
	}
}

export default V1Router.getInstance()
