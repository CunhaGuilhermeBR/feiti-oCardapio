import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { handlerNestedFiles } from '@/infrastructure/http/middlewares/handlerNestedFiles'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'
import { ConfigurableItemService } from '@/services/configurableItem'
import { InterviewService } from '@/services/interview'
import { InterviewQuestionnaireService } from '@/services/interviewQuestionnaire'
import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import zod from 'zod'
import { InterviewPageRenderData, Question } from './types'


export class InterviewController {
	private router: Router
	private application: Application
	private configurableItemSvc: ConfigurableItemService
	private questionnaireSvc: InterviewQuestionnaireService
	private interviewSvc: InterviewService

	private static instance: InterviewController

	static getInstance(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		questionnaireSvc: InterviewQuestionnaireService,
		interviewSvc: InterviewService
	) {
		if (!InterviewController.instance) {
			InterviewController.instance = new InterviewController(
				application,
				configurableItemSvc,
				questionnaireSvc,
				interviewSvc
			)
		}
		return InterviewController.instance
	}

	private constructor(
		application: Application,
		configurableItemSvc: ConfigurableItemService,
		questionnaireSvc: InterviewQuestionnaireService,
		interviewSvc: InterviewService
	) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.questionnaireSvc = questionnaireSvc
		this.configurableItemSvc = configurableItemSvc
		this.interviewSvc = interviewSvc
		this.application = application
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getInterviewPage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const url = zod.string().parse(req.headers.host)
		try {
			const questionIndex = zod.coerce
				.number()
				.default(1)
				.parse(req.query.question)
 

			if (!req.session) {
				throw new SessionNotFound()
			}

			const interviewId = req.session.interviewId
			if (!interviewId) {
				throw new SessionNotFound()
			}

			const saleId = req.session.saleId
			if (!saleId) {
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

			const questionnaireId = zod.number().positive().parse(+req.params.questionnaireId)

			const result = await this.configurableItemSvc.findOne('INTERVIEW', url)

			const questionnaire = await this.questionnaireSvc.findOne(questionnaireId)

			const listQuestion: Question[] = questionnaire.InterviewQuestions.map(question => ({
				index: question.index,
				description: question.question,
				minlength: question.ConfigQuestion.minlength,
				maxlength: question.ConfigQuestion.maxlength
			}))


			const interview = await this.interviewSvc.findOne(interviewId)

			const interviewPageRenderData: InterviewPageRenderData = {
				title: result.title,
				logoImageUrl: result.Application.imageurl,
				questionnaireId: questionnaireId,
				configInterviewQuestionnaire: {
					title: result.title,
					description: result.description,
				},
				buttons: {
					next: 'Próxima pergunta',
					nextRoute: '/speckResult',
					back: 'Pergunta anterior',
					backRoute: '/presentation',
					isBackDisabled: questionIndex <= 1,
					isNextDisabled: questionIndex >= listQuestion.length,
				},
				listQuestion,
				actualQuestionIndex: questionIndex,
				interviewId,
				saleId: saleId,
				templateId: interview.Template.id,
				url,
				customerName: userInterviewName,
				customerEmail: interview.Sale.email,
				vocational: interview.Template.vocational,
				headerText: interview.Template.title
			}
			res.render('interview/index', interviewPageRenderData)
		} catch (error: any) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/interview/:questionnaireId', this.getInterviewPage.bind(this))
	}

	private setupMiddlewares() {
		this.router.use(handlerNestedFiles)
	}

	public getController() {
		return this.router
	}
}