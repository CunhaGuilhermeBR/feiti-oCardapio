import { z } from 'zod'

export const AcceptTCLEFieldCreateSchema = z.object({
	saleId: z.string(),
	ConfigConsentTermCheckFieldsId: z.number()
})
