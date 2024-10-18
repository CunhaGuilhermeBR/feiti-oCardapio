import { Application } from 'express'
import { FeedbackController } from '../feedback'
import Services from '@/services'

class MakeFeedbackController {
	private constructor() {}

	public static execute(application: Application): FeedbackController {
		return FeedbackController.getInstance(application, Services.Feedback)
	}
}

export default MakeFeedbackController
