import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { FeedbackPageRenderData } from './types'
import { FeedbackService } from '@/services/feedback'
// import zod from 'zod'
import path from 'path'
import favicon from 'serve-favicon'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'

export class FeedbackController {
	private router: Router
	private application: Application
	private feedbackService: FeedbackService

	private static instance: FeedbackController

	static getInstance(
		application: Application,
		feedbackService: FeedbackService,
	) {
		if (!FeedbackController.instance) {
			FeedbackController.instance = new FeedbackController(
				application,
				feedbackService,
			)
		}
		return FeedbackController.instance
	}

	private constructor(
		application: Application,
		feedbackService: FeedbackService,
	) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.application = application
		this.feedbackService = feedbackService
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router)
	}

	private async getFeedbackPage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const feedbackData = await this.feedbackService.findAllPending()

			if (!feedbackData) {
				throw new SessionNotFound()
			}

			const feedbackPageRenderData: FeedbackPageRenderData = {
				title: 'Devolutivas',
				logoUrl: '../public/assets/logos/Logo-Speck-EAD.svg',
				leaveButton: 'Sair',
				configFeedbackTextArea: feedbackData.map((feedback) => ({
					title: 'Devolutivas',
					textAreaTitle: feedback.title,
					textAreaBody: feedback.content,
					feedbackDate: new Date(feedback.createdat).toLocaleDateString(
						'pt-BR',
					),
					id: feedback.saleId,
					editIcon: '../public/assets/icons/edit.svg',
					okIcon: '../public/assets/icons/check-mark.svg',
					infoIcon: '../public/assets/icons/info.png',
				})),
			}

			res.render('feedback/feedback', feedbackPageRenderData)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/feedback/pending', this.getFeedbackPage.bind(this))
	}

	private setupMiddlewares() {}

	public getController() {
		return this.router
	}
}
