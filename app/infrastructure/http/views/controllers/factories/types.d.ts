import { AuthenticationController } from '../authentication'
import { ConfigurableItemController } from '../configurableItem'
import { InterviewController } from '../interview'
import { FeedbackController } from '../feedback'
import { SelectNameController } from '../selectName'
import { SelectQuestionnaireController } from '../selectQuestionnaire'
import { ConsentTermController } from '../configConsentTerm'
import { TermsController } from '../terms'
import { TutorController } from '../tutor'
import { RecommendationController } from '../recommendation'
import { AdminController } from '../admin'

interface IControllerFactory {
	Admin: AdminController,
	Authentication: AuthenticationController
	ConfigurableItem: ConfigurableItemController
	ConsentTerm: ConsentTermController
	Interview: InterviewController
	Feedback: FeedbackController
	Recommendation: RecommendationController
	SelectName: SelectNameController
	SelectQuestionnaire: SelectQuestionnaireController
	Terms: TermsController
	Tutor: TutorController
}

export default IControllerFactory
