import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { ConfigurableItemService } from '@/services/configurableItem'
import { PageRenderData } from './types'
import zod from 'zod'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { logger } from '@/infrastructure/logger'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'


export class ConsentTermController {
	private configurableItemSvc: ConfigurableItemService
	private router: Router
	private application: Application

	private static instance: ConsentTermController

	static getInstance(
		application: Application,
		configurableItemSvc: ConfigurableItemService	
	) {
		if (!ConsentTermController.instance) {
			ConsentTermController.instance = new ConsentTermController(
				application,
				configurableItemSvc
			)
		}
		return ConsentTermController.instance
	}

	private constructor(
		application: Application,
		configurableItemSvc: ConfigurableItemService
	) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.application = application
		this.configurableItemSvc = configurableItemSvc
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getPage(req: Request, res: Response, next: NextFunction) {
		try {
			const url = zod.string().parse(req.query.url)

			if (!req.session) {
				logger.error('Session not found')
				throw new SessionNotFound()
			}

			const interviewId = req.session.interviewId
			if (!interviewId) {
				logger.error('InterviewID on Session not found')
				throw new SessionNotFound()
			}

			const saleId = req.session.saleId
			if (!saleId) {
				logger.error('Sale not found')
				throw new SessionNotFound()
			}

			const alreadyResponded = req.session.alreadyResponded
			if (alreadyResponded) {
				res.redirect('/speckResult')
			}

			const result = await this.configurableItemSvc.findOne('CONSENTTERM', url)
			const pageRenderData: PageRenderData = {
				title: result.title,
				imageUrl: result.imageUrl,
				description: result.description,
				logoImageUrl: result.Application.imageurl,
				button: 'Aceitar',
				nextPage: '/selectQuestionnaire',
			}
			res.render('genericPage/', pageRenderData)
		} catch (error: any) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/acceptConsentTerm', this.getPage.bind(this))
	}

	private setupMiddlewares() {
	}

	public getController() {
		return this.router
	}
}
