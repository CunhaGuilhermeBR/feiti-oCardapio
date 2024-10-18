import { z } from 'zod'

const TCLEFieldSchema = z.object({
	description: z.string(),
})

export const TCLECreateSchema = z.object({
	itemId: z.number().int().positive().optional(),
	appId: z.number().int().positive(),
	items: z.array(TCLEFieldSchema).optional(),
})

export const TCLEUpdateSchema = z.object({
	description: z.string()
})
