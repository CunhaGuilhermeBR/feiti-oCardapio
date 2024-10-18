import { z } from 'zod'

export const TutorCreateSchema = z.object({
	email: z.string().email(),
	password: z.string()
})

export const TutorUpdateSchema = z.object({
	email: z.string().email().optional(),
	password: z.string().optional(),
	firstLogin: z.boolean().optional()
})