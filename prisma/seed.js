/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client')
const { v4: uuidv4 } = require('uuid')
const prisma = new PrismaClient()

async function main() {
	// Upsert Application
	const app = await prisma.application.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			url: 'localhost:8080',
			name: 'Speck Test',
			imageurl:
        'https://static.wikia.nocookie.net/zelda/images/1/15/TotK_Link_Artwork.png/revision/latest?cb=20230605001448&path-prefix=pt-br',
			enabled: true,
		},
	})

	// Configs
	// Upsert ConfigurableItem
	const configItem = await prisma.configurableItem.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			enabled: true,
			title: 'Configurable Item 1',
			description: 'Just a item',
			applicationId: 1,
		},
	})

	// Upsert ConfigurableItemLabels
	const configurableItemLabels = await prisma.configurableItemLabels.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			key: 'Item 1',
			value: 'Item 1',
			itemId: 1,
		},
	})

	// Upsert ConfigQuestionnaire
	const configQuestionnaire = await prisma.configQuestionnaire.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			itemId: configItem.id,
		},
	})

	// Upsert ConfigQuestion
	const configQuestion = await prisma.configQuestion.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			itemId: configItem.id,
			questionnaireId: configQuestionnaire.id,
		},
	})

	// Upser ConfigMoodle
	await prisma.configMoodle.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			moodleApiUrl: 'moodleUrl.com.ur',
			moodleApiToken: 'yeshOvoshchiISlushaysyaRoditeley',
			itemId: 1,
		},
	})

	// Upsert ConfigInterview
	const configInterview = await prisma.configInterview.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			itemId: configItem.id,
		},
	})

	// Upsert ConfigInterviewQuestion
	await prisma.configInterviewQuestion.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			itemId: 1,
		},
	})

	// Upsert ConfigConsentTerm
	await prisma.configConsentTerm.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			itemId: configItem.id,
		},
	})

	// Upsert ConfigConsentTermCheckFields
	await prisma.configConsentTermCheckFields.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			itemId: 1,
			consentTermId: 1,
		},
	})
	// END CONFIGS

	// Upsert Sale
	const saleId = uuidv4()
	const sale = await prisma.sale.upsert({
		where: { id: saleId },
		update: {},
		create: {
			id: saleId,
			externalId: 'fad5d6e5-911f-4a9e-bb8b-ca53dd50ee97',
			email: 'johnDoe@cobol.com.br',
			source: 'WIX',
			applicationId: 1,
		},
	})
	// Upsert Template
	const templateId = uuidv4()
	const template = await prisma.template.upsert({
		where: { id: templateId },
		update: {},
		create: {
			id: templateId,
			title: 'Template do relatório ' + templateId,
			interviewQuestionnaireId: 1,
			configTCLEId: 1,
		},
	})

	// Upsert Interview
	const interview = await prisma.interview.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			configInterviewId: 1,
			saleId: saleId,
			templateId: template.id,
		},
	})

	await prisma.sale.update({
		where: { id: saleId },
		data: {
			interviewId: 1,
		},
	})

	// Upsert InterviewQuestionnaire
	await prisma.interviewQuestionnaire.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			configQuestionnaireId: configQuestionnaire.id,
		},
	})

	// Upsert InterviewQuestion
	const interviewQuestion = await prisma.interviewQuestion.upsert({
		where: { questionnaireId_index: { questionnaireId: 1, index: 1 } },
		update: {},
		create: {
			questionnaireId: 1,
			index: 1,
			question: 'Qual o sentido da vida?',
			configQuestionId: 1,
		},
	})

	// Upsert ConfigSpeckResult
	await prisma.configSpeckResult.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			speckApiToken: 'MangeDesLégumesEtObéisATesParents',
			speckTemplateId: templateId,
			itemId: configItem.id,
		},
	})

	// Upsert AcceptTCLEField
	await prisma.acceptTCLEField.upsert({
		where: {
			saleId_ConfigConsentTermCheckFieldsId: {
				saleId: saleId,
				ConfigConsentTermCheckFieldsId: 1,
			},
		},
		update: {},
		create: {
			saleId: saleId,
			ConfigConsentTermCheckFieldsId: 1,
			accept: true,
		},
	})

	// Upsert SpeckResult
	const speckResult = await prisma.speckResult.upsert({
		where: { id: 1 },
		update: {},
		create: {
			id: 1,
			interviewId: 1,
			essayId: uuidv4(),
			pdfReportFile: Buffer.from('pdf content'),
			configSpeckResultId: 1,
			// ToDo change this name
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
