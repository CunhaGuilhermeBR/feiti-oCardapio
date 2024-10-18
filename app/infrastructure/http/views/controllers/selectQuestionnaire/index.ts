import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { SelectQuestionnaireRenderData } from './types'
import zod from 'zod'
import { ConfigurableItemService } from '@/services/configurableItem'
import { InterviewQuestionnaireService } from '@/services/interviewQuestionnaire'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'


export class SelectQuestionnaireController {
	private router: Router
	private application: Application
	private configurableItemSvc: ConfigurableItemService
	private questionnaireSvc: InterviewQuestionnaireService

	private static instance: SelectQuestionnaireController

	static getInstance(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		questionnaireSvc: InterviewQuestionnaireService) {
		if (!SelectQuestionnaireController.instance) {
			SelectQuestionnaireController.instance = new SelectQuestionnaireController(application, configurableItemSvc, questionnaireSvc)
		}
		return SelectQuestionnaireController.instance
	}

	private constructor(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		questionnaireSvc: InterviewQuestionnaireService) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.questionnaireSvc = questionnaireSvc
		this.configurableItemSvc = configurableItemSvc
		this.application = application
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getSelectQuestionnairePage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const url = zod.string().parse(req.headers.host)
			if (!req.session) {
				throw new SessionNotFound()
			}
			
			const saleId = req.session.saleId
			
			if (!saleId) {
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

			const alreadyResponded = req.session.alreadyResponded
			if (alreadyResponded) {
				return res.redirect('/speckResult')
			}

			const alreadyConsented = req.session.alreadyConsented
			
			if (!alreadyConsented) {
				return res.redirect(`/speck-store/${interviewId}`)
			}

			const result = await this.configurableItemSvc.findOne('SELECTQUESTIONNAIRE', url)
			const listQuestionnaire = await this.questionnaireSvc.findAllByApplicationUrl(url)
			
			const selectQuestionnaireRenderData: SelectQuestionnaireRenderData = {
				title: result.title,
				description: result.description,
				listQuestionnaire: listQuestionnaire,
				logoImageUrl: result.Application.imageurl,
				configInterviewQuestionnaire: {
					title: result.title,
					description: result.description
				}
			}
			res.render('selectQuestionnaire/', selectQuestionnaireRenderData)
            
		} catch (error: any) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/selectQuestionnaire', this.getSelectQuestionnairePage.bind(this))
	}

	private setupMiddlewares() {
	}

	public getController() {
		return this.router
	}
}
