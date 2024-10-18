import { Application, NextFunction, Request, Response, Router } from 'express'
import { SaleService } from '@/services/sale'
import zod from 'zod'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { $Enums } from '@prisma/client'

export class AuthenticationController {
	private application: Application
	private router: Router
	private salesSvc: SaleService

	private static instance: AuthenticationController

	static getInstance(
		application: Application,
		salesSvc: SaleService
	) {
		if (!AuthenticationController.instance) {
			AuthenticationController.instance = new AuthenticationController(
				application,
				salesSvc
			)
		}
		return AuthenticationController.instance
	}

	private constructor(
		application: Application,
		salesSvc: SaleService
	) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.application = application
		this.salesSvc = salesSvc
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/speck-store', this.router, pageErrorHandler)
	}

	private async authenticate(req: Request, res: Response, next: NextFunction) {
		try {
			const interviewId = zod.string().parse(req.params.interviewId)
			const user = await this.salesSvc.login(interviewId)
			req.session.alreadyResponded = user.responded
			req.session.alreadyConsented = await this.salesSvc.verifyIfAllConsentTermAreAccepted(user.saleId, interviewId)
			req.session.saleId = user.saleId
			req.session.interviewId = interviewId
			// This a request made by management, before we redirect to selectQuestionnaire if we already have a name
			if (req.session.alreadyConsented) {
				/*
				if(req.session.interviewUserName){
					return res.redirect('/selectQuestionnaire')
				}
				*/
				req.session.interviewUserName = user.Sale.customerName
				req.session.save()
				const redirectPage = user.Sale.source === $Enums.SaleSource.MOODLE ? '/selectQuestionnaire' : '/selectName'
				return res.redirect(redirectPage)
			}
			req.session.interviewUserName = user.Sale.customerName
			req.session.save()
			res.redirect('/presentation')
		} catch (error) {
			next(error)
		}
	}
	private setupRoutes() {
		this.router.get('/:interviewId', this.authenticate.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}

export default AuthenticationController.getInstance
