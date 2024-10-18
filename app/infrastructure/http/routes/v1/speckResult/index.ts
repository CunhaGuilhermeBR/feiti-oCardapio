import { NextFunction, Request, Response, Router } from 'express'
import { IConfigSpeckResult, SendSampleInput, SendSampleInputSchema } from './types'
import zod from 'zod'
import { NotFoundError } from '@/services/errors'
import { ConfigurableItemService } from '@/services/configurableItem'
import { InterviewService } from '@/services/interview'
import { SaleService } from '@/services/sale'
import RabbitMQWrapper from '@/infrastructure/datasources/rabbitMQ'
import { logger } from '@/infrastructure/logger'
import { NotAllTermsAreAccepted } from './errors'
import SpeckWrapper from '@/infrastructure/datasources/speck'
import { CourseService } from '@/services/course'
import { RecommendationService } from '@/services/recommendation'
import { sendGenericEmail } from '@/infrastructure/email'
import { EmailService } from '@/services/email'
import { $Enums } from '@prisma/client'
import { SpeckError } from '@/infrastructure/datasources/speck/errors'

export class SpeckResultRouter {
	private router: Router
	private configurableItemSvc: ConfigurableItemService
	private interviewSvc: InterviewService
	private salesSvc: SaleService
	private speckWrapper: SpeckWrapper
	private courseSvc: CourseService
	private recommendationSvc: RecommendationService
	private emailSvc: EmailService

	private static instance: SpeckResultRouter

	static getInstance(
		configurableItemSvc: ConfigurableItemService,
		interviewSvc: InterviewService,
		salesSvc: SaleService,
		speckWrapper: SpeckWrapper,
		courseSvc: CourseService,
		recommendationSvc: RecommendationService,
		emailSvc: EmailService
	) {
		if (!SpeckResultRouter.instance) {
			SpeckResultRouter.instance = new SpeckResultRouter(
				configurableItemSvc,
				interviewSvc,
				salesSvc,
				speckWrapper,
				courseSvc,
				recommendationSvc,
				emailSvc
			)
		}
		return SpeckResultRouter.instance
	}

	private constructor(
		configurableItemSvc: ConfigurableItemService,
		interviewSvc: InterviewService,
		salesSvc: SaleService,
		speckWrapper: SpeckWrapper,
		courseSvc: CourseService,
		recommendationSvc: RecommendationService,
		emailSvc: EmailService
	) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.emailSvc = emailSvc
		this.configurableItemSvc = configurableItemSvc
		this.interviewSvc = interviewSvc
		this.salesSvc = salesSvc
		this.speckWrapper = speckWrapper
		this.courseSvc = courseSvc
		this.recommendationSvc = recommendationSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	private async validateRequest(req: Request) {
		const url = zod.string().parse(req.headers.host)
		const sendSampleBody = SendSampleInputSchema.parse(req.body)

		if (!sendSampleBody) {
			throw new NotFoundError('SendSampleInput', 'body')
		}

		const configSpeckResult = await this.configurableItemSvc.findOne('SPECKRESULT', url)
		if (!configSpeckResult || !configSpeckResult.ConfigSpeckResult[0]) {
			throw new NotFoundError('ConfigSpeckResult', 'url')
		}

		const sale = await this.salesSvc.findOneById(sendSampleBody.interview.saleId)
		if (!sale) {
			throw new NotFoundError('Sale', 'id')
		}

		const allAlreadyAccepted = await this.salesSvc.verifyIfAllConsentTermAreAccepted(
			sendSampleBody.interview.saleId,
			sendSampleBody.interview.id
		)

		if (!allAlreadyAccepted) {
			logger.error('Not all consent terms are accepted')
			throw new NotAllTermsAreAccepted()
		}

		return { sendSampleBody, configSpeckResult, sale }
	}

	private async processNonMoodle(
		sendSampleBody: SendSampleInput,
		configSpeckResult: IConfigSpeckResult,
		res: Response
	) {
		const rabbitDatasource = await RabbitMQWrapper.getInstance()
		await rabbitDatasource.publishInQueue(
			JSON.stringify({
				sample: sendSampleBody.interview.InterviewAnswers.map((r) => r.answer).join(' '),
				generate: ['pdf'],
				includes: sendSampleBody.vocational ? ['vocational'] : null,
				template: sendSampleBody.interview.templateId,
				reference: sendSampleBody.customerName,
			}),
			configSpeckResult.ConfigSpeckResult[0],
			sendSampleBody.interview.id,
			configSpeckResult.Application.name
		)

		await this.interviewSvc.markAsResponded(sendSampleBody.interview.id)
		logger.info('Success to send message on RabbitMQ')
		res.status(201).send()
	}

	/** 
	 * This flow is just to generate course recommendations
	 */
	private async processMoodle(
		sendSampleBody: SendSampleInput,
		configSpeckResult: IConfigSpeckResult
	) {
		const speckSample = await this.speckWrapper.sendSample(configSpeckResult.ConfigSpeckResult[0], sendSampleBody)
		if (!speckSample) {
			throw new SpeckError(500, 'Error to send sample to Speck')
		}

		const speckReportData = await this.speckWrapper.getReportData(
			speckSample.data.essayId,
			sendSampleBody.interview.templateId,
			configSpeckResult.ConfigSpeckResult[0]
		)
		if (!speckReportData){
			throw new SpeckError(500, 'Error to get report data from Speck')
		}

		const dataToCalc = speckReportData.data[0].data.characteristics
			.flatMap((characteristic) => characteristic.children)
			.flatMap((child) => [child, ...child.children])

		const results = await Promise.all(dataToCalc.map(async (data) => {
			const course = await this.courseSvc.findByShortName(data._id)
			const score = data.score * (course.goodFeature ? 1 : -1)
			return { course, score }
		}))

		// Criar a recomendação para os 6 piores resultados
		const worstResults = results.sort((a, b) => b.score - a.score).slice(-6)

		await Promise.all(
			worstResults.map((result) =>
				this.recommendationSvc.createARecommendation(sendSampleBody.interview.id, result.course.shortName)
			)
		)
	}

	/**
	 * @swagger
	 * /api/v1/speckresult:
	 *   post:
	 *     summary: Create a SpeckResult from an interview
	 *     description: Creates a new SpeckResult using the provided interview data and generates a PDF report.
	 *     tags:
	 *       - SpeckResult
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               interview:
	 *                 type: object
	 *                 properties:
	 *                   id:
	 *                     type: string
	 *                     description: The ID of the interview
	 *                   configInterviewId:
	 *                     type: integer
	 *                     description: The ID of the configuration interview
	 *                   saleId:
	 *                     type: string
	 *                     description: The sale ID associated with the interview
	 *                   templateId:
	 *                     type: string
	 *                     description: The template ID associated with the interview
	 *                   createdat:
	 *                     type: string
	 *                     format: date-time
	 *                     description: The creation date of the interview
	 *                   updatedat:
	 *                     type: string
	 *                     format: date-time
	 *                     description: The last update date of the interview
	 *                   InterviewAnswers:
	 *                     type: array
	 *                     items:
	 *                       type: object
	 *                       properties:
	 *                         answer:
	 *                           type: string
	 *                           description: The answer text
	 *                         index:
	 *                           type: integer
	 *                           description: The index of the answer
	 *                         interviewId:
	 *                           type: integer
	 *                           description: The ID of the interview
	 *                         createdat:
	 *                           type: string
	 *                           format: date-time
	 *                           description: The creation date of the answer
	 *                         updatedat:
	 *                           type: string
	 *                           format: date-time
	 *                           description: The last update date of the answer
	 *               customerName:
	 *                 type: string
	 *                 description: The name of the customer
	 *     responses:
	 *       201:
	 *         description: Successfully created the SpeckResult
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: integer
	 *                   description: The ID of the created SpeckResult
	 *                 interviewId:
	 *                   type: integer
	 *                   description: The ID of the interview
	 *                 pdfReportFile:
	 *                   type: string
	 *                   format: byte
	 *                   description: The PDF report file in bytea encoding
	 *       400:
	 *         description: Bad Request
	 *       500:
	 *         description: Internal Server Error
	 */
	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				sendSampleBody,
				configSpeckResult,
				sale
			} = await this.validateRequest(req)

			if (sale.source === $Enums.SaleSource.MOODLE) {
				await this.processMoodle(sendSampleBody, configSpeckResult)
				await this.notifyStudent(
					sendSampleBody.customerEmail,
					zod.string().parse(req.headers.host),
					sendSampleBody.interview.id)
			}
			await this.processNonMoodle(sendSampleBody, configSpeckResult, res)
			res.status(201).send()
		} catch (error) {
			next(error)
		}
	}

	private async notifyStudent(customerEmail: string, appUrl: string, interviewId: string) {
		const email = await this.emailSvc.findByApplication(undefined, process.env.EAD_URL)
		const htmlText = `    <div style="text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
								<h3 style="font-family: Arial, sans-serif; font-size: 16px;">Olá, tudo bem? Esta é uma mensagem automática do Speck EAD.</h3>
								<p style="font-family: Arial, sans-serif; font-size: 16px;">Foram geradas recomendações de cursos para você, por favor acesse o link abaixo e conclua sua matrícula.</p>
							    <a href="https://${appUrl}/recommendation/${interviewId}" 
                                    style="display: inline-block; padding: 10px 20px; font-family: Arial, sans-serif; font-size: 16px; 
                                    color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                                    Concluir Matrícula
                                </a>

								 <img src="https://speck-ead-pdf.s3.br-sao.cloud-object-storage.appdomain.cloud/Logo-Speck-EAD.svg" alt="Logo Speck EAD" style="margin-top: 20px; width: 150px;">
							   </div">
								`
		await sendGenericEmail({
			to: customerEmail,
			subject: '[Speck EAD] Recomendações de curso',
			host: email.host,
			applicationEmail: email.email,
			applicationEmailPassword: email.emailPassword,
			domain: email.domain,
			port: email.port,
		}, htmlText)
	}

	private setupRoutes() {
		this.router.post('/', this.create.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default SpeckResultRouter.getInstance
