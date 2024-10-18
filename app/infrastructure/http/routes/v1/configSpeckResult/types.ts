import { z } from 'zod'

export const ConfigSpeckResultRequestBody = z.object({
    speckOrigin: z.string(),
    speckApiToken: z.string(),
    speckUrl: z.string(),
    itemId: z.number().int().positive().optional(),
    appId: z.number().int().positive().optional(),
})

export const ConfigSpeckResultUpdateRequestBody = z.object({
    speckOrigin: z.string().optional(),
    speckApiToken: z.string().optional(),
    speckUrl: z.string().optional(),
    itemId: z.number().int().positive().optional(),
    appId: z.number().int().positive().optional(),
})

