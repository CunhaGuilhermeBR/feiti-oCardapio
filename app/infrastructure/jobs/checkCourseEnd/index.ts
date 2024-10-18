import Services from '@/services'
import { logger } from '@/infrastructure/logger'
import { sendGenericEmail } from '@/infrastructure/email'
import { MoodleSubmissionWithIncludes } from '../createFeedback/types'
import GPTWrapper from '@/infrastructure/datasources/openai'
import { formatSubmissionsToMessages } from '../createFeedback'

const loggerPrefix = 'JOB: CHECK COURSE END'
const salesSvc = Services.Sale
const emailSvc = Services.Email
const tasksSvc = Services.MoodleTask
const moodleSubmissionSvc = Services.MoodleSubmission
const feedbackSvc = Services.Feedback
const gptWrapper = new GPTWrapper()

export async function executeCourseEndJob(): Promise<void> {
	try {
		logger.info(loggerPrefix)
		const sales = await salesSvc.findAllBySource('MOODLE')

		if (!sales) {
			return
		}

		const moodleTasks = await tasksSvc.findAll()

		for (const sale of sales) {
			const courseDeadline = differenceInDays(new Date(), new Date(sale.createdat))
			if (courseDeadline === process.env.COURSES_DAYS - 10) {
				const email = await emailSvc.findByApplication(undefined, process.env.EAD_URL)
				const htmlText = `
								<h3 style="font-family: Arial, sans-serif; font-size: 16px;">Olá, tudo bem? Essa é uma mensagem automática do Speck EAD.</h3>
								<p style="font-family: Arial, sans-serif; font-size: 16px;">Faltam 10 dias para acabar o ciclo do seu curso, por favor acesse e finalize qualquer tarefa pendente.</p>
							`
				await sendGenericEmail({
					to: sale.email,
					subject: '[Speck EAD] Prazo para finalizar o curso',
					host: email.host,
					applicationEmail: email.email,
					applicationEmailPassword: email.emailPassword,
					domain: email.domain,
					port: email.port,
				}, htmlText)
				continue
			}
			if (courseDeadline === process.env.COURSES_DAYS) {
				for (const task of moodleTasks) {
					const submissions: MoodleSubmissionWithIncludes[] = await moodleSubmissionSvc.findAllByCourse(sale.id, task.courseName)
					
					if (!submissions) {
						return
					}

					const messagesToIa = formatSubmissionsToMessages(submissions)
					const analysedData = await gptWrapper.chat(messagesToIa)
					await feedbackSvc.create({
						saleId: sale.id,
						title: `Feedback do módulo ${task.name} do curso ${task.courseName}`,
						content: analysedData,
					})
				}
			}

		}
	} catch (error) {
		logger.error(loggerPrefix + ': ' + error)
		throw error
	}
}

function differenceInDays(date1: Date, date2: Date): number {
	const differenceInMilliseconds = date1.getTime() - date2.getTime()
	const millisecondsPerDay = 1000 * 60 * 60 * 24
	return Math.floor(differenceInMilliseconds / millisecondsPerDay)
}