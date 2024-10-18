import RepositoryFactory from '@/repositories'
import { InterviewQuestionnaireService } from '../interviewQuestionnaire'

class MakeInterviewQuestionnaireService {
	private constructor() {}

	public static execute(): InterviewQuestionnaireService {
		return InterviewQuestionnaireService.getInstance(
			RepositoryFactory.InterviewQuestionnaire,
			RepositoryFactory.ConfigQuestionnaire,
			RepositoryFactory.ConfigurableItem
		)
	}
}

export default MakeInterviewQuestionnaireService.execute()
