import CosDatasource from '@/infrastructure/datasources/cos'
import { sendGenericEmail } from '@/infrastructure/email'
import { logger } from '@/infrastructure/logger'
import pdfGenerator from '@/infrastructure/pdfGenerator'
import { EmailRepository } from '@/repositories/email'
import { FeedbackRepository } from '@/repositories/feedback'
import { TutorRepository } from '@/repositories/tutor'
import { NotCreatedError, NotFoundError } from '@/services/errors'
import { $Enums } from '@prisma/client'
import { FeedbackDTO, UpdateFeedbackDTO } from './types'


export class FeedbackService {
	private feedbackRepository: FeedbackRepository
	private emailRepository: EmailRepository
	private tutorRepository: TutorRepository
	private static instance: FeedbackService
	private pdfGenerator: pdfGenerator
	private cos: CosDatasource

	public static getInstance(
		feedbackRepository: FeedbackRepository,
		emailRepository: EmailRepository,
		tutorRepository: TutorRepository,
		pdfGenerator: pdfGenerator,
		cos: CosDatasource) {
		if (!this.instance) {
			this.instance = new FeedbackService(feedbackRepository, emailRepository, tutorRepository, pdfGenerator, cos)
		}
		return this.instance
	}

	private constructor(feedbackRepository: FeedbackRepository,
		emailRepository: EmailRepository,
		tutorRepository: TutorRepository,
		pdfGenerator: pdfGenerator,
		cos: CosDatasource) {
		this.cos = cos
		this.pdfGenerator = pdfGenerator
		this.tutorRepository = tutorRepository
		this.emailRepository = emailRepository
		this.feedbackRepository = feedbackRepository
	}

	public async findOne(title: string, saleId: string) {
		logger.info(`Finding Feedback for title: ${title} for sale ${saleId}`)
		const result = await this.feedbackRepository.findByTitle(saleId, title)
		if (!result) {
			throw new NotFoundError('Feedback', 'saleId_title')
		}
		return result
	}

	public async create(data: FeedbackDTO) {
		logger.info(`Creating Feedback for body: ${data}`)
		const result = await this.feedbackRepository.create(data)
		if (!result) {
			throw new NotCreatedError('Feedback')
		}
		await this.notifyTutors()
		return result
	}

	public async findAllPending() {
		logger.info('Finding all pending feedbacks')
		const result = await this.feedbackRepository.findAllPending()
		if (!result) {
			throw new NotFoundError('Interview Questionnaire', 'all')
		}
		return result
	}

	public async update(data: UpdateFeedbackDTO, title: string, saleId: string) {
		logger.info(`Update feedbacks for title: ${title} for sale ${saleId}`)
		const result = await this.feedbackRepository.findByTitle(saleId, title)
		if (!result) {
			throw new NotFoundError('Feedback', 'saleId_title')
		}
		const changedToApproved = result.status !== data.status && data.status === $Enums.FeedbackStatus.APPROVED
		if (changedToApproved) {
			const pdf = await this.pdfGenerator.generatePdf({
				studentName: result.Sale.customerName,
				dateNow: new Intl.DateTimeFormat('pt-BR').format(new Date()),
				feedback: data.content || result.content
			},
			'feedbackTemplate')
			const formattedName = result.title.replace(/ /g, '')
			const pdfLink = await this.cos.createObject(`Feedback${result.saleId}_${formattedName}.pdf`, pdf)
			this.notifyStudent(result.Sale.email, result.Sale.customerName, pdfLink)
		}
		return await this.feedbackRepository.update(saleId, title, data)
	}

	private async notifyTutors() {
		const email = await this.emailRepository.findByApplication(undefined, process.env.EAD_URL)
		const tutors = await this.tutorRepository.findAll()
		const adminPanelLink = `${process.env.EAD_URL}/feedback/pending`

		const htmlText = `
              <h3 style="font-family: Arial, sans-serif; font-size: 16px;">Olá, tudo bem? Essa é uma mensagem automática do Speck EAD.</h3>
              <p style="font-family: Arial, sans-serif; font-size: 16px;">Uma nova devolutiva foi cadastrada.</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px;">Acesse o painel administrativo <a href="${adminPanelLink}" style="color: #0000FF; text-decoration: underline;">(${adminPanelLink})</a> para aprová-los.</p>
            `
		for (const tutor of tutors) {
			await sendGenericEmail({
				to: tutor.email,
				subject: '[Speck EAD] Nova devolutiva',
				host: email.host,
				applicationEmail: email.email,
				applicationEmailPassword: email.emailPassword,
				domain: email.domain,
				port: email.port,
			}, htmlText)
		}
	}

	private async notifyStudent(customerEmail: string, customerName: string, pdfLink: string) {
		const email = await this.emailRepository.findByApplication(undefined, process.env.EAD_URL)
		const htmlText = `
             <div style="text-align: center; font-family: Arial, sans-serif; font-size: 16px;">
               <h3>Olá, ${customerName} tudo bem? Essa é uma mensagem automática do Speck EAD.</h3>
               <p>Uma nova devolutiva foi cadastrada para você.</p>
               <p>Para baixá-la, <a href="${pdfLink}" style="color: #0000FF; text-decoration: underline;">CLIQUE AQUI</a></p>
  

               <img src="https://speck-ead-pdf.s3.br-sao.cloud-object-storage.appdomain.cloud/Logo-Speck-EAD.svg" alt="Logo Speck EAD" style="margin-top: 20px; width: 150px;">
             </div>
 `
		await sendGenericEmail({
			to: customerEmail,
			subject: '[Speck EAD] Nova devolutiva',
			host: email.host,
			applicationEmail: email.email,
			applicationEmailPassword: email.emailPassword,
			domain: email.domain,
			port: email.port,
		}, htmlText)
	}

}