import { z } from 'zod'

export const ApplicationRequestBody = z.object({
    url: z.string(),
    name: z.string(),
    imageurl: z.string(),
    enabled: z.boolean().optional(),
})

export const ApplicationUpdateRequestBody = z.object({
    url: z.string().optional(),
    name: z.string().optional(),
    imageurl: z.string().optional(),
    enabled: z.boolean().optional(),
})

