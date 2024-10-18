import { z } from 'zod'

const ConfigurableItem = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
})

export const InterviewQuestionnaireRequestBodySchema = z.object({
	configQuestionnaireId: z.number().int().positive(),
})

export const InterviewQuestionnaireUpdateRequestBodySchema = z.object({
	configQuestionnaireId: z.number().int().positive().optional(),
	configurableItem: ConfigurableItem.optional()
})