import { z } from 'zod'

export const FeedbackSchema = z.object({
	content: z.string(),
	status: z.enum(['PENDING', 'APPROVED']),
	saleId: z.string(),
	title: z.string(),
})

export const UpdateFeedbackSchema = z.object({
	content: z.string().optional(),
	status: z.enum(['PENDING', 'APPROVED']).optional(),
	title: z.string().optional(),
	saleId: z.string().optional()
})
