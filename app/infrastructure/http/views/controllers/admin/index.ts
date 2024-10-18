import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { DashboardPageData } from './types'
import { ApplicationService } from '@/services/application'

export class AdminController {
	private applicationSvc: ApplicationService
	private router: Router
	private application: Application

	private static instance: AdminController

	static getInstance(
		application: Application,
		applicationSvc: ApplicationService
	) {
		if (!AdminController.instance) {
			AdminController.instance = new AdminController(application, applicationSvc)
		}
		return AdminController.instance
	}

	private constructor(
		application: Application,
		applicationSvc: ApplicationService) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.applicationSvc = applicationSvc
		this.application = application
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getLoginAdminPage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		this.application.locals.onClickFunction = (): string => {
			return `
			async function handleClick() {
	try{
	    const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="Password"]').value;

        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
		window.location.href = "/admin/homepage";
	}catch(err){
	throw err
	}
}
	handleClick();`
		}

		res.render('admin/login/login', { onClickFunction: this.application.locals.onClickFunction() })

	}

	private async getDashboardPage(req: Request, res: Response, next: NextFunction) {
		//ToDo Validate if user is logged
		const dashboardPageData: DashboardPageData = {
			dashboardCards: [
				{ title: 'Telas', description: 'Edição de título, conteúdo, vídeo, imagem, texto botão e redirecionamento.', icon: '../../public/assets/icons/picture.svg', href: '/admin/screens' },
				{ title: 'E-mail', description: 'Edição do e-mail, host, senha e dados do e-mail.', icon: '../../public/assets/icons/messageOpen.svg', href: '/admin/email' },
				{ title: 'Usuários', description: 'Edição dos usuários das plataformas do projeto.', icon: '../../public/assets/icons/profiles.svg', href: '/admin/user' },
				{ title: 'Tutor', description: 'Edição dos tutores, sendo e-mail e senha.', icon: '../../public/assets/icons/profile2.svg', href: '/admin/tutor' },
				{ title: 'Speck', description: 'Edição de API Key e dados de acesso ao Speck.', icon: '../../public/assets/icons/flatStar.svg', href: '/admin/speck' },
				{ title: 'Moodle', description: 'Edição dos dados do Moodle, como APIKey.', icon: '../../public/assets/icons/monitor.svg', href: '/admin/moodle' },
				{ title: 'Aplicações', description: 'Edição de host, nome, imagem e dados da aplicação.', icon: '../../public/assets/icons/puzzle.svg', href: '/admin/application' },
				{ title: 'Templates', description: 'Edição de nome, ID e qual aplicação pertence.', icon: '../../public/assets/icons/paper.svg', href: '/admin/template' },
				{ title: 'Termos de consentimento', description: 'Edição do termo e políticas.', icon: '../../public/assets/icons/infoIcon.svg', href: '/admin/term' },
				{ title: 'Questionários e Perguntas', description: 'Edição e criação de perguntas', icon: '../../public/assets/icons/gear.svg', href: '/admin/questionnaire' },
			],
			logoImageUrl: 'https://speck-ead-pdf.s3.br-sao.cloud-object-storage.appdomain.cloud/Logo-Speck-EAD.svg'
		}

		res.render('admin/dashboard/dashboard', dashboardPageData)
	}

	private async getApplicationsPage(req: Request, res: Response, next: NextFunction) {
		const applications = await this.applicationSvc.findAll()
		const data = applications.map(app => [
			app.url,
			app.name,
			app.imageurl,
			app.enabled,
			{
				type: 'actions',
				id: app.id,
				fields: {
					name: app.name,
					url: app.url,
					imageUrl: app.imageurl
				}
			}
		])

		res.render('admin/application/listApplications', {
			activeIcon: '../../public/assets/icons/activeAdmin.svg',
			desactiveIcon: '../../public/assets/icons/desactiveAdmin.svg',
			editIcon: '../../public/assets/icons/editTableAdmin.svg',
			deleteIcon: '../../public/assets/icons/deleteAdmin.svg',
			data
		}
		)
	}

	private setupRoutes() {
		this.router.get('/admin/login', this.getLoginAdminPage.bind(this))
		this.router.get('/admin/dashboard', this.getDashboardPage.bind(this))
		this.router.get('/admin/application', this.getApplicationsPage.bind(this))
	}

	private setupMiddlewares() {
	}

	public getController() {
		return this.router
	}


}
