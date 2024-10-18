import { Application } from 'express'
import { RecommendationController } from '../recommendation'
import Services from '@/services'

class MakeRecommendationController {
	private constructor() {}

	public static execute(application: Application): RecommendationController {
		return RecommendationController.getInstance(
			application,
			Services.Recommendation,
		)
	}
}

export default MakeRecommendationController
