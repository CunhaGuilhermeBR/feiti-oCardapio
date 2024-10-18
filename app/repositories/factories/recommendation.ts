import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { RecommendationRepository } from '@/repositories/recommendation'

class MakeRecommendationRepository {
	private constructor() {}

	public static execute(): RecommendationRepository {
		return RecommendationRepository.getInstance(prisma)
	}
}

export default MakeRecommendationRepository.execute()
