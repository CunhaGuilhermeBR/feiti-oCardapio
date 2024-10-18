import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { ConfigurableItemService } from '@/services/configurableItem'
import { PageRenderData, Pages } from './types'
import zod from 'zod'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'
import { InterviewService } from '@/services/interview'
import { $Enums } from '@prisma/client'


export class ConfigurableItemController {
	private configurableItemSvc: ConfigurableItemService
	private router: Router
	private application: Application
	private interviewSvc: InterviewService

	private static instance: ConfigurableItemController

	static getInstance(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		interviewSvc: InterviewService
	) {
		if (!ConfigurableItemController.instance) {
			ConfigurableItemController.instance = new ConfigurableItemController(
				application,
				configurableItemSvc,
				interviewSvc
			)
		}
		return ConfigurableItemController.instance
	}

	private constructor(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		interviewSvc: InterviewService
	) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.interviewSvc = interviewSvc
		this.application = application
		this.configurableItemSvc = configurableItemSvc
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getPage(req: Request, res: Response, next: NextFunction) {
		try {
			const url = zod.string().parse(req.headers.host)
			let page = zod.string().parse(req.params.page).toUpperCase()
			
			if (!req.session) {
				throw new SessionNotFound()
			}

			const interviewId = req.session.interviewId
			if (!interviewId) {
				throw new SessionNotFound()
			}

			const userInterviewName = req.session.interviewUserName
			if (!userInterviewName) {
				throw new SessionNotFound()
			}

			const saleId = req.session.saleId
			if (!saleId) {
				throw new SessionNotFound()
			}

			const alreadyResponded = req.session.alreadyResponded
			if (alreadyResponded) {
				page = Pages.SPECKRESULT
			}
            
			const result = await this.configurableItemSvc.findOne(page, url)
			const interview = await this.interviewSvc.findOne(interviewId)
			const videoLabel = result.ConfigurableItemLabels
				.find((label: any) => label.key === 'video')
			const buttonLabel = result.ConfigurableItemLabels
				.find((label: any) => label.key === 'button')
			const nextPageRedirect = result.ConfigurableItemLabels
				.find((label: any) => label.key === 'nextPage')
			const pageRenderData: PageRenderData = {
				title: result.title,
				imageUrl: result.imageUrl,
				description: result.description,
				videoUrl: videoLabel ? videoLabel.value : null,
				iconUrl: 'public/assets/icons/youtube.svg',
				logoImageUrl: result.Application.imageurl,
				nextPage: nextPageRedirect ? nextPageRedirect.value : '/terms',
				headerText: interview.Sale.source === $Enums.SaleSource.MOODLE ? null : interview.Template.title
			}

			if (page !== Pages.SPECKRESULT) {
				pageRenderData.button = buttonLabel ? buttonLabel.value : 'Continuar'
			}

			res.render('genericPage/', pageRenderData)
		} catch (error: any) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/:page', this.getPage.bind(this))
	}

	private setupMiddlewares() { }

	public getController() {
		return this.router
	}
}