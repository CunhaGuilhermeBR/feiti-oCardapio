import { Application } from 'express'
import Services from '@/services'
import { InterviewController } from './../interview'

class MakeInterviewController {
	private constructor() {}

	public static execute(application: Application): InterviewController {
		return InterviewController.getInstance(
			application,
			Services.ConfigurableItem,
			Services.InterviewQuestionnaire,
			Services.Interview
		)
	}
}

export default MakeInterviewController
