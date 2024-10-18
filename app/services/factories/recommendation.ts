import RepositoryFactory from '@/repositories'
import { RecommendationService } from '../recommendation'

class MakeRecommendationService {
	private constructor() { }

	public static execute(): RecommendationService {
		return RecommendationService.getInstance(
			RepositoryFactory.Recommendation,
			RepositoryFactory.Course
		)
	}
}

export default MakeRecommendationService.execute()
