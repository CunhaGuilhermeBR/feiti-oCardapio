import { z } from 'zod'

export const ProductRequestBody = z.object({
	name: z.string(),
	description: z.string().optional(),
	price: z.string(),
	options: z.array(z.string()).optional(),
	categoryId: z.string(),
	active: z.boolean().optional()
})

export const ProductUpdateRequestBody = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.string().optional(),
	options:z.array(z.string()).optional(),
	categoryId: z.string().optional(),
	active: z.boolean().optional()
})

