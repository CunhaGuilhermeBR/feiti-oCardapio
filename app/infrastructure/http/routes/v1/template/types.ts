import { z } from 'zod'

export const TemplateRequestBody = z.object({
    id: z.string(),
    title: z.string(),
    vocational: z.boolean().default(false),
    configTCLEId: z.number().int().positive().optional(),
    appId: z.number().int().positive().optional(),
})

export const TemplateUpdateRequestBody = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    vocational: z.boolean().optional(),
    configTCLEId: z.number().int().positive().optional(),
    appId: z.number().int().positive().optional(),
})

