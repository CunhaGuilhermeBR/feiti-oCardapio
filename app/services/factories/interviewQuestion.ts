import RepositoryFactory from '@/repositories'
import { InterviewQuestionService } from '../interviewQuestion'

class MakeInterviewQuestionService {
	private constructor() {}

	public static execute(): InterviewQuestionService {
		return InterviewQuestionService.getInstance(
			RepositoryFactory.InterviewQuestion,
			RepositoryFactory.ConfigQuestion
		)
	}
}

export default MakeInterviewQuestionService.execute()
