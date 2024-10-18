import RepositoryFactory from '@/repositories'
import { MoodleTaskService } from '../moodleTask'

class MakeMoodleTaskService {
	private constructor() { }

	public static execute(): MoodleTaskService {
		return MoodleTaskService.getInstance(
			RepositoryFactory.MoodleTask
		)
	}
}

export default MakeMoodleTaskService.execute()
