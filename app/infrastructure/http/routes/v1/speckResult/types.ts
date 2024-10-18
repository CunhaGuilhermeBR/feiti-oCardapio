import { z } from 'zod'


export const InterviewAnswerSchema = z.object({
	answer: z.string(),
	index: z.number().int().positive(),
})


export const InterviewWithAnswersSchema = z.object({
	id: z.string(),
	saleId: z.string(),
	templateId: z.string(),
	InterviewAnswers: z.array(InterviewAnswerSchema),
})

export const SendSampleInputSchema = z.object({
	interview: InterviewWithAnswersSchema,
	customerName: z.string(),
	customerEmail: z.string(),
	vocational: z.boolean()
})

export type SendSampleInput = z.infer<typeof SendSampleInputSchema>


const ApplicationSchema = z.object({
	name: z.string(),
	imageurl: z.string(),
})

const ConfigurableItemLabelsSchema = z.object({
	value: z.string(),
	key: z.string(),
})


const ConfigSpeckResultSchema = z.object({
	id: z.number(),
	speckApiToken: z.string(),
	speckOrigin: z.string(),
	speckUrl: z.string(),
	itemId: z.number(),
})

const IConfigSpeckResultSchema = z.object({
	title: z.string(),
	description: z.string(),
	imageUrl: z.string().nullable(),
	Application: ApplicationSchema,
	ConfigurableItemLabels: z.array(ConfigurableItemLabelsSchema),
	ConfigSpeckResult: z.array(ConfigSpeckResultSchema),
})


export type IConfigSpeckResult = z.infer<typeof IConfigSpeckResultSchema>