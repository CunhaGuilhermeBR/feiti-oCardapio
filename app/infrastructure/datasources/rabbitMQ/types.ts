import zod from 'zod'

export type SpeckResultQueue = {
    reference: string,
    pdf: string,
    correlationId: string
}


export const consumeQueueSchema = zod.object({
	reference: zod.string(),
	pdf: zod.string(),
})