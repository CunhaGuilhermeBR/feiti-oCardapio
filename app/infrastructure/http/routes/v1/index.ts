import MoodleWrapper from '@/infrastructure/datasources/moodle'
import SpeckWrapper from '@/infrastructure/datasources/speck'
import Services from '@/services'
import { Router } from 'express'
import AutheticationRouter from './authentication'
import ConfigurableItemRouter from './configurableItem'
import CourseRouter from './courses'
import FeedbackRouter from './feedback'
import HealthRouter from './health'
import QuestionRouter from './question'
import QuestionnaireRouter from './questionnaire'
import RecommendationRouter from './recommendation'
import SpeckResultRouter from './speckResult'
import ConsentTermRouter from './terms'
import AccecptTCLERouter from './consentTerm'
import MoodleRouter from './moodle'
import TutorRouter from './tutor'
import AdminRouter from './admin'
import EmailRouter from './email'
import TemplateRouter from './template'
import ConfigSpeckResultRouter from './configSpeckResult'
import ApplicationRouter from './application'

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
			'/configurableItem',
			ConfigurableItemRouter(
				Services.ConfigurableItem
			).getRouter()
		)
		this.V1Router.use(
			'/moodle',
			MoodleRouter(
				MoodleWrapper.getInstance(),
				Services.Interview,
			).getRouter()
		)
		this.V1Router.use(
			'/authenticate',
			AutheticationRouter(
				Services.Sale,
				MoodleWrapper.getInstance(),
				Services.Interview,
				Services.Template,
				Services.Tutor
			).getRouter()
		)
		this.V1Router.use(
			'/tutor',
			TutorRouter(
				Services.Tutor
			).getRouter()
		)
		this.V1Router.use(
			'/questionnaire',
			QuestionnaireRouter(
				Services.InterviewQuestionnaire
			).getRouter()
		)
		this.V1Router.use(
			'/question',
			QuestionRouter(
				Services.InterviewQuestion
			).getRouter()
		)
		this.V1Router.use(
			'/speckResult',
			SpeckResultRouter(
				Services.ConfigurableItem,
				Services.Interview,
				Services.Sale,
				new SpeckWrapper(),
				Services.Course,
				Services.Recommendation,
				Services.Email
			).getRouter()
		)
		this.V1Router.use(
			'/terms',
			ConsentTermRouter(
				Services.ConsentTerm,
			).getRouter()
		)
		this.V1Router.use(
			'/acceptTCLE',
			AccecptTCLERouter(
				Services.ConsentTerm
			).getRouter()
		)
		this.V1Router.use(
			'/feedback',
			FeedbackRouter(
				Services.Feedback
			).getRouter()
		)
		this.V1Router.use(
			'/health',
			HealthRouter(
			).getRouter()
		)
		this.V1Router.use(
			'/recommendation',
			RecommendationRouter(
				Services.Recommendation
			).getRouter()
		)
		this.V1Router.use(
			'/course',
			CourseRouter(
				Services.Course,
				Services.Recommendation
			).getRouter()
		)
		this.V1Router.use(
			'/admin',
			AdminRouter.getRouter()
		)
		this.V1Router.use(
			'/applicationEmail',
			EmailRouter(
				Services.Email
			).getRouter()
		)
		this.V1Router.use(
			'/template',
			TemplateRouter(
				Services.Template
			).getRouter()
		)
		this.V1Router.use(
			'/configSpeckResult',
			ConfigSpeckResultRouter(
				Services.ConfigSpeckResult
			).getRouter()
		)
		this.V1Router.use(
			'/application',
			ApplicationRouter(
				Services.Application
			).getRouter()
		)

	}

	private setupMiddlewares() { }

	getRouter() {
		return this.V1Router
	}
}

export default V1Router.getInstance()
