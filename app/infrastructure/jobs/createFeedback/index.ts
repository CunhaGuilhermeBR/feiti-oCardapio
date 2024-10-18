import Services from '@/services'
import { logger } from '@/infrastructure/logger'
import MoodleWrapper from '@/infrastructure/datasources/moodle'
import { messageIa, MoodleSubmissionWithIncludes } from './types'
import GPTWrapper from '@/infrastructure/datasources/openai'
import pdfGenerator from '@/infrastructure/pdfGenerator'
import CosDatasource from '@/infrastructure/datasources/cos'

const loggerPrefix = 'JOB: CREATE FEEDBACK'
const moodleSubmissionSvc = Services.MoodleSubmission
const tasksSvc = Services.MoodleTask
const moodle = MoodleWrapper.getInstance()
const salesSvc = Services.Sale
const feedbackSvc = Services.Feedback
const gptWrapper = new GPTWrapper()
const pdf = pdfGenerator.getInstance()
const cos = CosDatasource.getInstance()

export async function executeCreateFeedbackJob(): Promise<void> {
	try {
		logger.info(loggerPrefix)
		const moodleTasks = await tasksSvc.findAll()

		for (const task of moodleTasks) {
			const moodleResponse = await moodle.getSubmissionByAssignment(task.id)

			if (!moodleResponse.assignments.length) {
				continue
			}
			const moodleSubmissions = moodleResponse.assignments[0].submissions.filter(
				(submission) => submission.status === 'submitted',
			)
			for (const submission of moodleSubmissions) {
				const alreadyExist = await moodleSubmissionSvc.findOne(submission.id)

				if (alreadyExist) {
					continue
				}

				const plugin = submission.plugins.find(
					(plugin) => plugin.type === 'onlinetext',
				)

				if (!plugin) {
					continue
				}

				let content = plugin.editorfields?.find((field) => field.name === 'onlinetext')?.text ?? 'Error ao obter conteúdo.'

				if (!content) {
					continue
				}
				content = formatContent(content)
				const userSale = await salesSvc.findByExternalId(submission.userid.toString())

				if (!userSale) {
					logger.error('Não foi encontrado a sale da submission')
					continue
				}
				await moodleSubmissionSvc.create({
					id: submission.id,
					content,
					moodleTaskId: task.id,
					saleId: userSale.id
				})

				const submissions: MoodleSubmissionWithIncludes[] = await moodleSubmissionSvc.findAllByCourse(userSale.id, task.courseName)

				const courseDeadline = differenceInDays(new Date(), new Date(userSale.createdat)) < process.env.COURSES_DAYS
				if (submissions.length >= 3 && courseDeadline) {
					const messagesToIa = formatSubmissionsToMessages(submissions)
					const analysedData = await gptWrapper.chat(messagesToIa)
					await feedbackSvc.create({
						saleId: userSale.id,
						title: `Feedback do curso ${task.courseName}`,
						content: analysedData
					})
					const feedbackPdf = await pdf.generatePdf({
						studentName: userSale.customerName,
						dateNow: new Date().toLocaleString('pt-BR'),
						feedback: analysedData
					}, 'feedbackTemplate')
					const feedbackUrl = await cos.createObject(`feedback${userSale.Interview[0].id}`, feedbackPdf)
					const experiencePdf = await pdf.generatePdf({
						studentName: userSale.customerName,
						dateNow: new Date().toLocaleString('pt-BR'),
						course: task.courseName,
						firstExperience: submissions[0].moodleTask.name.replace('Vivência ', ''),
						firstAssignment: submissions[0].moodleTask.prompt,
						firstSubmission: submissions[0].content,
						secondExperience: submissions[1].moodleTask.name.replace('Vivência ', ''),
						secondAssignment: submissions[1].moodleTask.prompt,
						secondSubmission: submissions[1].content,
						thirdExperience: submissions[2].moodleTask.name.replace('Vivência ', ''),
						thirdAssignment: submissions[2].moodleTask.prompt,
						thirdSubmission: submissions[2].content,
					}, 'experienceTemplate')
					const experienceUrl = await cos.createObject(`experience${userSale.Interview[0].id}`, experiencePdf)

					await moodle.addFeedbackToAssignment({
						email: userSale.email,
						moodleAssignmentId: submissions[0].moodleTask.id,
						experienceUrl,
						feedbackUrl,
					})
				}
			}
		}

	} catch (error) {
		logger.error(loggerPrefix + ': ' + error)
		throw error
	}
}

function formatContent(content: string) {
	content = content.replace(/<\/div>/gi, '\n')
	content = content.replace(/<\/li>/gi, '\n')
	content = content.replace(/<li>/gi, '  *  ')
	content = content.replace(/<\/ul>/gi, '\n')
	content = content.replace(/<\/p>/gi, '\n')
	content = content.replace(/<br\s*[/]?>/gi, '\n')
	content = content.replace(/<[^>]+>/gi, '')
	return content
}

function differenceInDays(date1: Date, date2: Date): number {
	const differenceInMilliseconds = date1.getTime() - date2.getTime()
	const millisecondsPerDay = 1000 * 60 * 60 * 24
	return Math.floor(differenceInMilliseconds / millisecondsPerDay)
}


export function formatSubmissionsToMessages(submissions: MoodleSubmissionWithIncludes[]): messageIa[] {
	// Changes on prompt requested by Alice, follow this doc https://docs.google.com/document/d/13wWzxsKizmlYQzYGj1Rbx0z00JTsA1N335w3GI9TCC4/edit
    // The changes in relation to the number of paragraphs are because the text was 'escaping' the design of the current PDF (25/09/2024), even though the problem with the current design has already been raised several times. https://docs.google.com/document/d/13wWzxsKizmlYQzYGj1Rbx0z00JTsA1N335w3GI9TCC4/edit
	const messages: messageIa[] = [
		{
			content: 'Você é um excelente profissional da área de Psicologia e professor em um curso de Desenvolvimento Socioemocional, baseado na teoria do Big Five. Você tem um curso online, no qual os alunos enviam suas respostas a respeito de suas vivências pessoais relacionadas ao módulo. As Vivências propostas para este módulo, juntamente com as respostas de um indivíduo, são as seguintes.',
			role: 'system',
		}
	]

	submissions.forEach((submission) => {
		messages.push({
			role: 'assistant',
			content: `[${submission.moodleTask.name}]: [${submission.moodleTask.prompt}]`,
		})
		messages.push({
			role: 'user',
			content: `Resposta: [${submission.content}]`,
		})
	})

	messages.push({
		content: 'Agora você deve analisar as respostas do indivíduo e dar um feedback sobre o que ele disse, considerando os seus esforços para desenvolver a característica. Resuma e dê um feedback sobre cada resposta, sinalizando pontos positivos e pontos a melhorar e incentivando o indivíduo ao desenvolvimento socioemocional naquela característica. Caso você se identifique, diga que é uma inteligência artificial. Trate sempre o indivíduo na segunda pessoa. Use as regras: Responda sempre em português. Limite-se a 2450 caracteres. Caso a resposta não seja em primeira pessoa, sinalize isso como um ponto de atenção. Caso a resposta não tenha relação com a pergunta, sinalize isso. Caso a resposta tenha menos que 15 palavras, é um indicativo de possível baixo empenho.',
		role: 'assistant'
	})

	return messages
}



