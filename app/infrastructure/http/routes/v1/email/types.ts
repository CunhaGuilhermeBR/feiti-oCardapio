import { z } from 'zod'

export const EmailRequestBodySchema = z.object({
	email: z.string(),
	emailPassword: z.string(),
	host: z.string(),
	domain: z.string(),
	port: z.number().int().positive(),
	applicationId: z.number().int().positive()
})

export const EmailUpdateRequestBodySchema = z.object({
	email: z.string().optional(),
	emailPassword: z.string().optional(),
	host: z.string().optional(),
	domain: z.string().optional(),
	port: z.number().int().positive().optional(),
	applicationId: z.number().int().positive().optional()
})


