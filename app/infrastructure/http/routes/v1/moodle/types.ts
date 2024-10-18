import { z } from 'zod'

export const EnrollSchema = z.object({
	coursesId: z.array(z.number()),
	interviewId: z.string()
})