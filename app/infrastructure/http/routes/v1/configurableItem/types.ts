import { z } from 'zod'

const ConfigPageTypeEnum = z.enum([
	'INSTRUCTIONS',
	'HOWITWORKS',
	'PRESENTATION',
	'ITEM',
	'SPECKRESULT',
	'INTERVIEW'
])

export const ConfigurableItemSchema = z.object({
	enabled: z.boolean().default(true),
	title: z.string(),
	description: z.string(),
	applicationId: z.number().int().positive().optional(),
	url:z.string().optional(),
	createdat: z.date().default(new Date()),
	updatedat: z.date().default(new Date()),
	configPageType: ConfigPageTypeEnum.default('ITEM'),
	index: z.number().int().positive().optional(),
	imageUrl: z.string().url().optional(),
})

export const UpdateConfigurableItemSchema = z.object({
	enabled: z.boolean().default(true),
	title: z.string().optional(),
	description: z.string().optional(),
	applicationId: z.number().int().positive().optional(),
	url:z.string().optional(),
	createdat: z.date().default(new Date()),
	updatedat: z.date().default(new Date()),
	configPageType: ConfigPageTypeEnum.default('ITEM'),
	index: z.number().int().positive().optional(),
	imageUrl: z.string().url().optional(),
})


