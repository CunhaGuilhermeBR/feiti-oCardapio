import { z } from 'zod'

const ConfigQuestion = z.object({
	minlength: z.number().int().positive().optional(),
	maxlength: z.number().int().positive().optional(),
})

export const InterviewQuestionRequestBodySchema = z.object({
	question: z.string().optional(),
	configQuestionId: z.number().int().positive().optional(),
	configQuestion: ConfigQuestion.optional()
})

export const InterviewQuestionCreateSchema = z.object({
	question: z.string(),
	configQuestionId: z.number().int().positive(),
	index: z.number().int().positive(),
	questionnaireId: z.number().int().positive(),
})
