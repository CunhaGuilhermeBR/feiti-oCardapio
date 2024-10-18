import { InterviewService } from '@/services/interview'
import RepositoryFactory from '@/repositories'

class MakeInterviewService {
	private constructor() {}

	public static execute(): InterviewService {
		return InterviewService.getInstance(RepositoryFactory.Interview)
	}
}

export default MakeInterviewService.execute()
