import Services from '@/services'
import { logger } from '@/infrastructure/logger'
import { sendDownloadEmail } from '@/infrastructure/email'
import { SpeckResultQueue } from './types'

const loggerPrefix = 'JOB: sendDelayedSpeckResult'
const emailSvc = Services.Email
const interviewSvc = Services.Interview

export async function sendDelayedSpeckResult(speckResult: SpeckResultQueue): Promise<void> {
	try {
		const interview = await interviewSvc.findOne(speckResult.correlationId)
		const email = await emailSvc.findByApplication(interview.Sale.Application.id)

		await sendDownloadEmail({
			to: interview.Sale.email,
			subject: 'Seu resultado Speck chegou!',
			name: speckResult.reference,
			link: speckResult.pdf,  // Now is link of document/pdf
			host: email.host,
			applicationEmail: email.email,
			applicationEmailPassword: email.emailPassword,
			domain: email.domain,
			port: email.port,
		})

	} catch (error) {
		logger.error(loggerPrefix + error)
		throw error
	}
}