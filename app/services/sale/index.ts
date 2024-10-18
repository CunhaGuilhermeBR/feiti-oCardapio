import { CreateSaleDTO, EmailType, SendAccessEmailDTO } from './types'
import { ApplicationRepository } from '@/repositories/application'
import { InterviewRepository } from '@/repositories/interview'
import { ConsentTermRepository } from '@/repositories/acceptTCLEFields'
import { logger } from '@/infrastructure/logger'
import { TemplateRepository } from '@/repositories/template'
import { SaleRepository } from '@/repositories/sale'
import { NotFoundError, PartialProcessed } from '@/services/errors'
import { sendAccessEmail } from '@/infrastructure/email'
import { EmailService } from '@/services/email'
import { $Enums } from '@prisma/client'


export class SaleService {
	private static instance: SaleService

	private applicationRepository: ApplicationRepository
	private interviewRepository: InterviewRepository
	private templateRepository: TemplateRepository
	private salesRepository: SaleRepository
	private emailSvc: EmailService
	private consentTermRepository: ConsentTermRepository


	public static getInstance(
		applicationRepository: ApplicationRepository,
		interviewRepository: InterviewRepository,
		templateRepository: TemplateRepository,
		salesRepository: SaleRepository,
		emailSvc: EmailService,
		consentTermRepository: ConsentTermRepository
	) {
		if (!this.instance) {
			this.instance = new SaleService(
				applicationRepository,
				interviewRepository,
				salesRepository,
				templateRepository,
				emailSvc,
				consentTermRepository
			)
		}
		return this.instance
	}

	private constructor(
		applicationRepository: ApplicationRepository,
		interviewRepository: InterviewRepository,
		salesRepository: SaleRepository,
		templateRepository: TemplateRepository,
		emailSvc: EmailService,
		consentTermRepository: ConsentTermRepository
	) {
		this.emailSvc = emailSvc
		this.applicationRepository = applicationRepository
		this.interviewRepository = interviewRepository
		this.salesRepository = salesRepository
		this.templateRepository = templateRepository
		this.consentTermRepository = consentTermRepository
	}

	public async register(data: CreateSaleDTO) {
		logger.info('Creating user', data)

		const application = await this.applicationRepository.findOneByURL(data.url)
		if (!application) {
			// fiz assim para que SEMPRE salve a venda, evitando assim perder dados.
			await this.salesRepository.create({
				email: data.user.email,
				externalId: data.externalID,
				source: data.source,
				applicationId: 7,
			})
			throw new NotFoundError('Application', 'url')
		}

		const sale = await this.salesRepository.create({
			email: data.user.email,
			externalId: data.externalID,
			source: data.source,
			applicationId: application.id,
			name: data.user.name,
		})

		logger.info('Sale registred', sale)

		// Anti PickPocket
		logger.warn('IT NOT GARANTEED THAT USER WILL RECEIVE EMAILS')

		const promises = data.templates.map(async (template) => {
			logger.info('Generating interview permission', template)
			const existsTemplate = await this.templateRepository.findByName(
				template,
				data.url
			)

			if (!existsTemplate) {
				throw new NotFoundError('Template', `name: ${template}`)
			}

			const interview = await this.interviewRepository.create({
				saleId: sale.id,
				templateId: existsTemplate.id,
			})

			logger.info('Interview Permission Generated', interview)

			if (data.source !== $Enums.SaleSource.MOODLE) {
				this.sendEmail(
					{
						appUrl: data.url,
						userMail: data.user.email,
						userName: data.user.name,
						interviewID: interview.id,
						appId: application.id
					}
				)
			}

			return interview
		})

		const results = await Promise.allSettled(promises)

		const promisesRejectedLength = results.filter(
			(result) => result.status === 'rejected'
		).length

		const promisesFulfilledLength = results.filter(
			(result) => result.status === 'fulfilled'
		).length

		const partialProcessed =
			promisesFulfilledLength !== results.length
			&& promisesRejectedLength !== results.length

		const allRejected = promisesRejectedLength === results.length

		switch (true) {
		case partialProcessed:
			logger.warn('Some templates were not processed')
			throw new PartialProcessed()
		case allRejected:
			logger.error('All templates were not processed')
			throw new NotFoundError('Template', 'name')
		default:
			return results.filter(
				(result) => result.status === 'fulfilled'
			).map((result) => result.value)
		}
	}

	public async verifyIfAllConsentTermAreAccepted(saleId: string, interviewID: string) {
		logger.info(`Verifying if all consent terms are accepted by saleId: ${saleId} and interviewID: ${interviewID}`)
		const accepted = await this.consentTermRepository.findAcceptedBySaleIdAndInterviewID(saleId, interviewID)
		if (!accepted.length) {
			logger.info('No consent term accepted')
			return false
		}
		const configCount = 
			await this.consentTermRepository.findShouldBeAcceptedByConfigConsentTermId(
				accepted[0].ConfigConsentTermCheckFields.ConfigConsentTerm.id
			)
		return accepted.length === configCount
	}

	public async login(interviewID: string) {
		logger.info('Logging user', interviewID)

		const interview = await this.interviewRepository.findById(interviewID)
		if (!interview) {
			throw new NotFoundError('interview', 'interviewID')
		}

		logger.info('User logged', interview)

		return interview
	}

	private async sendEmail(data: SendAccessEmailDTO) {
		logger.info('Sending email', data.interviewID)

		const email = await this.emailSvc.findByApplication(data.appId)
		const accessLink = `https://${data.appUrl}/speck-store/${data.interviewID}`

		await sendAccessEmail({
			to: data.userMail,
			subject: 'Sua compra está disponível!',
			name: data.userName,
			link: accessLink,
			host: email.host,
			applicationEmail: email.email,
			applicationEmailPassword: email.emailPassword,
			domain: email.domain,
			port: email.port,
		})

		logger.info('Email sent', accessLink)

		return accessLink
	}

	public async resendAEmailToAExternalId(externalId: string, emailType: EmailType) {
		logger.info(`Sending email to sale externalId ${externalId} with emailType ${emailType}`)

		const sale = await this.findByExternalId(externalId)

		if (!sale) {
			throw new NotFoundError('Sale', 'saleId')
		}

		const sendStoreAccessEmail = 
			emailType === EmailType.SALE_ACCESS && 
			sale.source !== $Enums.SaleSource.MOODLE
			
		if (sendStoreAccessEmail) {
			sale.Interview.forEach(async interview => { 
				this.sendEmail({
					appId: sale.applicationId,
					appUrl: sale.Application.url,
					userMail: sale.email,
					userName: sale.customerName,
					interviewID: interview.id,
				})
			})
		}
	}

	public async findByExternalId(externalId: string) {
		logger.info(`Finding by external id ${externalId}`)
		return await this.salesRepository.findByExternalId(externalId)
	}

	public async findAllBySource(source: $Enums.SaleSource) {
		logger.info(`Finding all by source ${source}`)
		return await this.salesRepository.findBySource(source)
	}

	public async findOneById(id: string) {
		logger.info(`Finding a Sale by id ${id}`)

		return await this.salesRepository.findById(id)
	}
}
