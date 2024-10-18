import Services from '@/services'
import { logger } from '@/infrastructure/logger'
import { sendGenericEmail } from '@/infrastructure/email'

const loggerPrefix = 'JOB: PENDING FEEDBACK'
const feedbackSvc = Services.Feedback
const emailSvc = Services.Email
const tutorsSvc = Services.Tutor

export async function executeFeedbackJob(): Promise<void> {
	try {
		logger.info(loggerPrefix)
		const pendingFeedbacks = await feedbackSvc.findAllPending()

		if (pendingFeedbacks.length > 0) {
			logger.info(loggerPrefix + ': Existem feedbacks pendentes de aprovação!')
			const adminPanelLink = `${process.env.EAD_URL}/feedback/pending`
			const htmlText = `
              <h3 style="font-family: Arial, sans-serif; font-size: 16px;">Olá, tudo bem? Essa é uma mensagem automática do Speck EAD.</h3>
              <p style="font-family: Arial, sans-serif; font-size: 16px;">Há ${pendingFeedbacks.length} feedbacks pendentes de aprovação.</p>
              <p style="font-family: Arial, sans-serif; font-size: 16px;">Acesse o painel administrativo <a href="${adminPanelLink}" style="color: #0000FF; text-decoration: underline;">(${adminPanelLink})</a> para aprová-los.</p>
            `
			const email = await emailSvc.findByApplication(undefined, process.env.EAD_URL)
			const tutors = await tutorsSvc.findAll()
			for (const tutor of tutors) {
				await sendGenericEmail({
					to: tutor.email,
					subject: '[Speck EAD] Feedbacks pendentes de aprovação',
					host: email.host,
					applicationEmail: email.email,
					applicationEmailPassword: email.emailPassword,
					domain: email.domain,
					port: email.port,
				}, htmlText)
			}
		}

	} catch (error) {
		logger.error(loggerPrefix + ': ' + error)
		throw error
	}
}

