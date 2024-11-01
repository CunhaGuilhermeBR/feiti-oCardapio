import { z } from 'zod'

export const CategoryRequestBody = z.object({
	name: z.string(),
	description: z.string().optional(),
})

export const CategoryUpdateRequestBody = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	
})

