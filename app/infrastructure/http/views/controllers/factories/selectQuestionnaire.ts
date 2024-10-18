import { Application } from 'express'
import Services from '@/services'
import { SelectQuestionnaireController } from './../selectQuestionnaire'

class MakeSelectQuestionnaireController {
	private constructor() {}

	public static execute(application: Application): SelectQuestionnaireController {
		return SelectQuestionnaireController.getInstance(
			application,
			Services.ConfigurableItem,
			Services.InterviewQuestionnaire
		)
	}
}

export default MakeSelectQuestionnaireController
