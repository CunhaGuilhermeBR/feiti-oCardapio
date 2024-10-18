import { TutorService } from '@/services/tutor'
import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import zod from 'zod'
import {  UnauthorizedError } from '@/services/errors'
import { LoginTutorSchema } from '@/infrastructure/http/routes/v1/authentication/types'
import { ConfigurableItemService } from '@/services/configurableItem'
import { LoginTutorPageData } from './types'

export class TutorController {
	private router: Router
	private application: Application
	private configurableItemSvc: ConfigurableItemService
	private tutorService: TutorService

	private static instance: TutorController

	static getInstance(application: Application, tutorService: TutorService, 		configurableItemSvc: ConfigurableItemService,
	) {
		if (!TutorController.instance) {
			TutorController.instance = new TutorController(application, tutorService, configurableItemSvc,)
		}
		return TutorController.instance
	}

	private constructor(application: Application, tutorService: TutorService, configurableItemSvc: ConfigurableItemService,) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.application = application
		this.tutorService = tutorService
		this.configurableItemSvc = configurableItemSvc
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router)
	}

	private async getLoginTutorPage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const url = zod.string().parse(req.headers.host)
		try {

			const login = await this.configurableItemSvc.findOne('LOGIN_TUTOR', url)

			const loginTutorPageData: LoginTutorPageData = {
				title: login.title,
				logoUrl: login.Application.imageurl,
				formTitle: 'Login', 
				buttonText: 'Entrar',
				configFormFields: {
					emailField: {
						label: 'E-mail',
						placeholder: 'Digite seu e-mail',
					},
					passwordField: {
						label: 'Senha',
						placeholder: 'Digite sua senha',
					},
				},				
				url
			}
			res.render('tutor/login/login', loginTutorPageData) 
		} catch (error) {
			next(error)
		}
	}

	private async loginTutor(req: Request, res: Response, next: NextFunction) {
		try {
			const data = LoginTutorSchema.parse(req.body)
			const login = await this.tutorService.login(data.email, data.password)
			return res.status(200).json(login)
		} catch (error) {			
			if (error instanceof UnauthorizedError) {
				return res.status(401).json({ message: 'Verifique suas credenciais e tente novamente.' })
			}
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/login', this.getLoginTutorPage.bind(this))
		this.router.post('/moodle/login', this.loginTutor.bind(this))
	}

	private setupMiddlewares() {        
	}

	public getController() {
		return this.router
	}
}