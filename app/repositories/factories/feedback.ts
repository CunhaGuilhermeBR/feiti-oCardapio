import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { FeedbackRepository } from '@/repositories/feedback'

class MakeFeedbackRepository {
	private constructor() {}

	public static execute(): FeedbackRepository {
		return FeedbackRepository.getInstance(
			prisma
		)
	}
}

export default MakeFeedbackRepository.execute()
