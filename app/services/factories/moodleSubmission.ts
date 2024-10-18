import RepositoryFactory from '@/repositories'
import { MoodleSubmissionService } from '../moodleSubmission'

class MakeMoodleSubmissionService {
	private constructor() { }

	public static execute(): MoodleSubmissionService {
		return MoodleSubmissionService.getInstance(
			RepositoryFactory.MoodleSubmission
		)
	}
}

export default MakeMoodleSubmissionService.execute()
