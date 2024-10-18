import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { ConfigurableItemService } from '@/services/configurableItem'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import zod from 'zod'
import { SessionNotFound } from '../errors'
import { SelectNameRenderData } from './types'
import { InterviewService } from '@/services/interview'

export class SelectPageController {
	private router: Router
	private application: Application
	private configurableItemSvc: ConfigurableItemService
	private interviewSvc: InterviewService

	private static instance: SelectPageController

	static getInstance(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		interviewSvc: InterviewService) {
		if (!SelectPageController.instance) {
			SelectPageController.instance = new SelectPageController(application, configurableItemSvc, interviewSvc)
		}
		return SelectPageController.instance
	}

	private constructor(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		interviewSvc: InterviewService) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.interviewSvc = interviewSvc
		this.configurableItemSvc = configurableItemSvc
		this.application = application
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getSelectNamePage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const url = zod.string().parse(req.headers.host)
		if (!req.session) {
			throw new SessionNotFound()
		}

		const alreadyResponded = req.session.alreadyResponded
		if (alreadyResponded) {
			return res.redirect('/speckResult')
		}

		const interviewId = req.session.interviewId
		if (!interviewId) {
			throw new SessionNotFound()
		}
		const interview = await this.interviewSvc.findOne(interviewId)


		const result = await this.configurableItemSvc.findOne('SELECTNAME', url)
		const buttonLabel = result.ConfigurableItemLabels
			.find((label: any) => label.key === 'button')
		const nextPageRedirect = result.ConfigurableItemLabels
			.find((label: any) => label.key === 'nextPage')
		const selectNameRenderData: SelectNameRenderData = {
			title: result.title,
			description: result.description,
			imageUrl: result.imageUrl,
			logoImageUrl: result.Application.imageurl,
			interviewName: interview.Sale.customerName,
			button: buttonLabel ? buttonLabel.value : 'Continuar',
			nextPage: nextPageRedirect ? nextPageRedirect.value : '/selectQuestionnaire',
			headerText: interview.Template.title
		}
		res.render('selectName/selectName', selectNameRenderData)
	}

	private setupRoutes() {
		this.router.get('/selectName', this.getSelectNamePage.bind(this))
	}

	private setupMiddlewares() {
	}

	public getController() {
		return this.router
	}
}
