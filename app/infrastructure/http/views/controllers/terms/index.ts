import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { TermsPageRenderData } from './types'
import { pageErrorHandler } from '@/infrastructure/http/middlewares/error'
import { ConsentTermService } from '@/services/consentTerm'
import zod from 'zod'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'
import { SaleService } from '@/services/sale'
import { $Enums } from '@prisma/client'


export class TermsController {
	private router: Router
	private application: Application
	private consentTermSvc: ConsentTermService
	private saleSvc: SaleService

	private static instance: TermsController

	static getInstance(
		application: Application,
		consentTermSvc: ConsentTermService,
		saleSvc: SaleService
	) {
		if (!TermsController.instance) {
			TermsController.instance = new TermsController(
				application,
				consentTermSvc,
				saleSvc
			)
		}
		return TermsController.instance
	}

	private constructor(
		application: Application,
		consentTermSvc: ConsentTermService,
		saleSvc: SaleService

	) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.saleSvc = saleSvc
		this.consentTermSvc = consentTermSvc
		this.application = application
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router, pageErrorHandler)
	}

	private async getTermsPage(req: Request, res: Response, next: NextFunction) {
		try {
			const url = zod.string().parse(req.headers.host)
			if (!req.session) {
				throw new SessionNotFound()
			}

			if (req.session.alreadyConsented) {
				return res.redirect('/selectQuestionnaire')
			}

			const alreadyResponded = req.session.alreadyResponded
			if (alreadyResponded) {
				return res.redirect('/speckResult')
			}

			const saleId = req.session.saleId

			if (!saleId) {
				throw new SessionNotFound()
			}

			const interviewId = req.session.interviewId

			if (!interviewId) {
				throw new SessionNotFound()
			}

			const configConsentTermCheckFields = await this.consentTermSvc.findConfigConsentTermFieldsByTemplateID(
				saleId,
				url
			)

			const sale = await this.saleSvc.findOneById(saleId)

			const termsPageRenderData: TermsPageRenderData = {
				nextPage: sale?.source === $Enums.SaleSource.MOODLE ? '/selectQuestionnaire' : '/selectName',
				title: configConsentTermCheckFields.Interview[0].Template.configTCLE.ConfigurableItem.title,
				content: configConsentTermCheckFields.Interview[0].Template.configTCLE.ConfigurableItem.description,
				saleId: saleId,
				accept: true,
				termCheckFields: sale?.source === $Enums.SaleSource.MOODLE ?
					(await this.consentTermSvc.findById(+process.env.MOODLE_CONSENT_TERM_ID)).ConfigConsentTermCheckFields.map(
						(field) => {
							return {
								id: field.id,
								label: field.ConfigurableItem.description
							}
						}
					) :
					configConsentTermCheckFields.Interview[0].Template.configTCLE.ConfigurableItem.ConfigConsentTerm[0].ConfigConsentTermCheckFields.map(
						(field) => {
							return {
								id: field.id,
								label: field.ConfigurableItem.description
							}
						}
					),
			}

			return res.render('terms/terms', termsPageRenderData)
		} catch (error) {
			req.session.alreadyConsented = false
			req.session.save()

			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/terms', this.getTermsPage.bind(this))
	}

	private setupMiddlewares() { }

	public getController() {
		return this.router
	}
}
