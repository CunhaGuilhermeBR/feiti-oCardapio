import { NextFunction, Request, Response, Router } from 'express'
import { logger } from '@/infrastructure/logger'
import { SaleService } from '@/services/sale'
import { LoginTutorSchema, WixStoreSchema } from './types'
import { InvalidData, TemplateNotInserted, UserDataNotFound } from './errors'
import zod from 'zod'
import MoodleWrapper from '@/infrastructure/datasources/moodle'
import { NotFoundError } from '@/services/errors'
import { KeyValuesGetFunction } from '@/infrastructure/datasources/moodle/types'
import { $Enums } from '@prisma/client'
import { InterviewService } from '@/services/interview'
import { TemplateService } from '@/services/template'
import { TutorService } from '@/services/tutor'

export class AuthenticationRouter {
	private salesSvc: SaleService
	private interviewSvc: InterviewService
	private templateSvc: TemplateService
	private moodle: MoodleWrapper
	private tutorSvc: TutorService
	private router: Router

	private static instance: AuthenticationRouter

	static getInstance(
		salesSvc: SaleService,
		moodle: MoodleWrapper,
		interviewSvc: InterviewService,
		templateSvc: TemplateService,
		tutorSvc: TutorService): AuthenticationRouter {
		if (!AuthenticationRouter.instance) {
			AuthenticationRouter.instance = new AuthenticationRouter(salesSvc, moodle, interviewSvc, templateSvc, tutorSvc)
		}
		return AuthenticationRouter.instance
	}

	private constructor(
		salesSvc: SaleService,
		moodle: MoodleWrapper,
		interviewSvc: InterviewService,
		templateSvc: TemplateService,
		tutorSvc: TutorService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.tutorSvc = tutorSvc
		this.templateSvc = templateSvc
		this.interviewSvc = interviewSvc
		this.moodle = moodle
		this.salesSvc = salesSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
	 * @swagger
	 * /api/v1/authenticate/{interviewId}:
	 *   get:
	 *     summary: Authenticate user
	 *     description: Authenticate user using their interviewId
	 *     tags:
	 *       - Authentication
	 *     parameters:
	 *       - in: path
	 *         name: interviewId
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: Interview ID
	 *     responses:
	 *       200:
	 *         description: Success
	 *       400:
	 *         description: Bad Request
	 *       500:
	 *         description: Internal Server Error
	 */
	private async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const interviewId = zod.string().parse(req.params.interviewId)
			const user = await this.salesSvc.login(interviewId)

			res.status(200).json(user)
		} catch (error) {
			next(error)
		}
	}

	/**
	 * @swagger
	 * /api/v1/authenticate/wix-store:
	 *   post:
	 *     summary: Process Wix Store webhook
	 *     description: Endpoint to process webhook data from Wix Store
	 *     tags:
	 *       - Wix Store
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/WixStoreRequestBody'
	 *     responses:
	 *       200:
	 *         description: Webhook processed successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/WixStoreResponseBody'
	 *       400:
	 *         description: Invalid webhook payload or user data not found
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *       500:
	 *         description: Internal Server Error
	 */
	private async wixWebHook(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const input = WixStoreSchema.parse(req.body)
			const url = zod.string().parse(req.headers.host)

			const haveUserInformationFromContact =
				(input.data?.contact?.name?.first || input.data?.contact?.name?.last) &&
				input.data?.contact?.email

			const haveUserInformationFromDetails =
				(input.data?.billingInfo?.contactDetails?.firstName ||
					input.data?.billingInfo?.contactDetails?.lastName) &&
				input.data?.buyerEmail

			const haveUserInformation =
				haveUserInformationFromDetails || haveUserInformationFromContact

			if (!haveUserInformation || !input.data.orderNumber) {
				throw new UserDataNotFound(input.data.contact, input.data.orderNumber)
			}

			if (!input.data.lineItems) {
				throw new TemplateNotInserted()
			}

			const customerName: string = ((input.data.contact?.name?.first ||
				input.data?.billingInfo?.contactDetails?.firstName) +
				' ' +
				(input.data.contact?.name?.last ||
					input.data.billingInfo?.contactDetails?.lastName))

			const customerEmail: string = (input.data?.contact?.email ||
				input.data?.buyerEmail) as string

			const interviews = await this.salesSvc.register({
				externalID: input.data.orderNumber,
				source: $Enums.SaleSource.WIX,
				url: url,
				user: {
					email: customerEmail,
					name: customerName,
				},
				templates: input.data.lineItems
					.map((item) => {
						const template = item?.itemName
						const quantity = item?.quantity || 1
						return Array.from({ length: quantity }, () => template)
					})
					.flat()
					.filter(
						(template) => template !== undefined && template !== null
					) as string[],
			})

			logger.info('Webhook processed successfully')

			res.status(200).json({
				message: 'Webhook processed successfully',
				interviews: interviews
			})
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/authenticate/changeUserName:
 *   post:
 *     summary: Change User Name
 *     description: Endpoint to change the interview user name in the session
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interviewName:
 *                 type: string
 *                 example: "New User Name"
 *     responses:
 *       200:
 *         description: User name changed successfully
 *       400:
 *         description: Invalid user name provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid user name"
 *       500:
 *         description: Internal Server Error
 */
	private async changeUserName(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const userName = zod.string().parse(req.body.interviewName)
			req.session.interviewUserName = userName
			req.session.save()
			res.status(200).send()
		} catch (err) {
			next(err)
		}
	}

	/**
 * @swagger
 * /api/v1/authenticate/loginMoodle/{token}:
 *   post:
 *     summary: Login to Moodle
 *     description: Endpoint to log in to Moodle using a provided token. If the user is not found in the sales database, a new entry is created and an interview ID is generated.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - name: token
 *         in: path
 *         description: Moodle token for authentication
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully logged in and retrieved interview ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interviewId:
 *                   type: string
 *                   example: "12345"
 *       201:
 *         description: Successfully created a new user entry and retrieved interview ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interviewId:
 *                   type: string
 *                   example: "67890"
 *       400:
 *         description: Invalid token or request format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       404:
 *         description: User or resource not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User in Moodle not found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An internal error occurred"
 */
	private async loginMoodle(req: Request, res: Response, next: NextFunction) {
		try {
			const moodleToken = zod.string().parse(req.params.token)
			const userData = this.moodle.parserMoodleToken(moodleToken)
			const userMoodle = (
				await this.moodle.getUserByCriteria(KeyValuesGetFunction.ID, userData.id.toString())
			).users[0]

			if (!userMoodle) {
				throw new NotFoundError('User in Moodle', 'ID')
			}
			const invalidAccessDates =
				new Date(userData.firstAccess).getTime() !== new Date(userMoodle.firstaccess).getTime() ||
				new Date(userData.lastAccess).getTime() !== new Date(userMoodle.lastaccess).getTime()
			if (invalidAccessDates) {
				throw new InvalidData()
			}
			const sale = await this.salesSvc.findByExternalId(userData.id.toString())

			// Ideal case, the user have a Sale(User) and a valid Interview(below 60 days)
			if (sale && sale.Interview[0]) {
				return res.status(200).json({ interviewId: sale.Interview[0].id })
			}

			// User already have a sale, but this interview is invalid now
			if (sale) {
				const existsTemplate = await this.templateSvc.findByName(
					process.env.DEFAULT_EAD_TEMPLATE,
					process.env.EAD_URL)
				if (!existsTemplate) {
					throw new NotFoundError('Template', `name: ${process.env.DEFAULT_EAD_TEMPLATE}`)
				}

				const interview = await this.interviewSvc.create({
					saleId: sale.id,
					templateId: existsTemplate.id
				})
				return res.status(201).json({ interviewId: interview.id })
			}

			// User dont have a sale, so they also dont have a interview xD


			const interviews = await this.salesSvc.register({
				externalID: userData.id.toString(),
				source: $Enums.SaleSource.MOODLE,
				url: process.env.EAD_URL,
				user: {
					email: userMoodle.email,
					name: userMoodle.fullname,
				},
				templates: [process.env.DEFAULT_EAD_TEMPLATE],
			})

			return res.status(201).json({ interviewId: interviews[0].id })

		} catch (err) {
			next(err)
		}
	}

	private async loginTutor(req: Request, res: Response, next: NextFunction){
		const data = LoginTutorSchema.parse(req.body)
		const login = await this.tutorSvc.login(data.email, data.password)
		return res.status(200).json(login)
	}

	private setupRoutes(): void {
		this.router.get('/:interviewId', this.authenticate.bind(this))
		this.router.get('/loginMoodle/:token', this.loginMoodle.bind(this))
		this.router.post('/wix-store', this.wixWebHook.bind(this))
		this.router.post('/moodle/login', this.loginTutor.bind(this))
		this.router.post('/changeUserName', this.changeUserName.bind(this))
	}

	private setupMiddlewares(): void { }

	public getRouter(): Router {
		return this.router
	}
}

/**
 * @swagger
 * components:
 *   schemas:
 *     WixStoreRequestBody:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Data'
 *     Data:
 *       type: object
 *       properties:
 *         invoices:
 *           type: array
 *           items: {}
 *         payments:
 *           type: array
 *           items: {}
 *         orderNumber:
 *           type: string
 *         purchaseFlowId:
 *           type: string
 *         cartId:
 *           type: string
 *         lineItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LineItem'
 *         paymentStatus:
 *           type: string
 *         refunds:
 *           type: array
 *           items: {}
 *         context:
 *           $ref: '#/components/schemas/Context'
 *         channelType:
 *           type: string
 *         checkoutCustomFields:
 *           type: object
 *         _context:
 *           $ref: '#/components/schemas/Context2'
 *         appliedDiscounts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AppliedDiscount'
 *         attributionSource:
 *           type: string
 *         contact:
 *           $ref: '#/components/schemas/Contact'
 *         weightUnit:
 *           type: string
 *         priceSummary:
 *           $ref: '#/components/schemas/PriceSummary'
 *         id:
 *           type: string
 *         buyerEmail:
 *           type: string
 *         status:
 *           type: string
 *         contactId:
 *           type: string
 *         billingInfo:
 *           $ref: '#/components/schemas/BillingInfo'
 *         fulfillmentStatusesAggregate:
 *           type: array
 *           items: {}
 *         catalogs:
 *           type: array
 *           items:
 *             type: string
 *         currency:
 *           type: string
 *         balanceSummary:
 *           $ref: '#/components/schemas/BalanceSummary'
 *         checkoutId:
 *           type: string
 *         buyerLanguage:
 *           type: string
 *         createdDate:
 *           type: string
 *     LineItem:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *         sku:
 *           type: string
 *         image:
 *           type: string
 *         totalPriceBeforeTax:
 *           $ref: '#/components/schemas/TotalPriceBeforeTax'
 *         taxRate:
 *           type: string
 *         shippable:
 *           type: boolean
 *         totalPrice:
 *           $ref: '#/components/schemas/TotalPrice'
 *         catalogItemId:
 *           type: string
 *         taxAmount:
 *           $ref: '#/components/schemas/TaxAmount'
 *         totalDiscount:
 *           $ref: '#/components/schemas/TotalDiscount'
 *         id:
 *           type: string
 *         itemType:
 *           type: string
 *         catalogId:
 *           type: string
 *         itemName:
 *           type: string
 *         descriptionLines:
 *           type: array
 *           items: {}
 *     TotalPriceBeforeTax:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     TotalPrice:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     TaxAmount:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     TotalDiscount:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Context:
 *       type: object
 *       properties:
 *         metaSiteId:
 *           type: string
 *         activationId:
 *           type: string
 *     Context2:
 *       type: object
 *       properties:
 *         activation:
 *           $ref: '#/components/schemas/Activation'
 *         configuration:
 *           $ref: '#/components/schemas/Configuration'
 *         app:
 *           $ref: '#/components/schemas/App'
 *         action:
 *           $ref: '#/components/schemas/Action'
 *         trigger:
 *           $ref: '#/components/schemas/Trigger'
 *     Activation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *     Configuration:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *     App:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *     Action:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *     Trigger:
 *       type: object
 *       properties:
 *         key:
 *           type: string
 *     AppliedDiscount:
 *       type: object
 *       properties:
 *         discountType:
 *           type: string
 *         coupon:
 *           $ref: '#/components/schemas/Coupon'
 *         lineItemIds:
 *           type: array
 *           items:
 *             type: string
 *         amount:
 *           $ref: '#/components/schemas/Amount2'
 *         discountName:
 *           type: string
 *         discountSourceType:
 *           type: string
 *     Coupon:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         amount:
 *           $ref: '#/components/schemas/Amount'
 *     Amount:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Amount2:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Contact:
 *       type: object
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/Name'
 *         email:
 *           type: string
 *         locale:
 *           type: string
 *         phones:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Phone'
 *         address:
 *           $ref: '#/components/schemas/Address3'
 *         emails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Email'
 *         phone:
 *           type: string
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Address3'
 *     Name:
 *       type: object
 *       properties:
 *         first:
 *           type: string
 *         last:
 *           type: string
 *     Phone:
 *       type: object
 *       properties:
 *         tag:
 *           type: string
 *         formattedPhone:
 *           type: string
 *         id:
 *           type: string
 *         primary:
 *           type: boolean
 *         phone:
 *           type: string
 *     Address3:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tag:
 *           type: string
 *         address:
 *           $ref: '#/components/schemas/Address4'
 *     Address4:
 *       type: object
 *       properties:
 *         subdivisions:
 *           type: array
 *           items: {}
 *         city:
 *           type: string
 *         countryFullname:
 *           type: string
 *         addressLine:
 *           type: string
 *         formattedAddress:
 *           type: string
 *         country:
 *           type: string
 *         postalCode:
 *           type: string
 *     Email:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tag:
 *           type: string
 *         email:
 *           type: string
 *         primary:
 *           type: boolean
 *     PriceSummary:
 *       type: object
 *       properties:
 *         tax:
 *           $ref: '#/components/schemas/Tax'
 *         total:
 *           $ref: '#/components/schemas/Total'
 *         subtotal:
 *           $ref: '#/components/schemas/Subtotal'
 *         discount:
 *           $ref: '#/components/schemas/Discount'
 *         shipping:
 *           $ref: '#/components/schemas/Shipping'
 *     Tax:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Total:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Subtotal:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Discount:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Shipping:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     BillingInfo:
 *       type: object
 *       properties:
 *         address:
 *           $ref: '#/components/schemas/Address4'
 *         contactDetails:
 *           $ref: '#/components/schemas/ContactDetails'
 *     ContactDetails:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *     BalanceSummary:
 *       type: object
 *       properties:
 *         balance:
 *           $ref: '#/components/schemas/Balance'
 *         paid:
 *           $ref: '#/components/schemas/Paid'
 *         refunded:
 *           $ref: '#/components/schemas/Refunded'
 *     Balance:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Paid:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Refunded:
 *       type: object
 *       properties:
 *         value:
 *           type: string
 *         currency:
 *           type: string
 *     Interviews:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         saleId:
 *           type: string
 *         templateId:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     WixStoreResponseBody:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         interviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Interviews'
 */

export default AuthenticationRouter.getInstance