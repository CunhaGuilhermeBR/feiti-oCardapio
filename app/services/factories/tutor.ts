import RepositoryFactory from '@/repositories'
import { TutorService } from '@/services/tutor'

class MakeTutorService {
	private constructor() { }

	public static execute(): TutorService {
		return TutorService.getInstance(
			RepositoryFactory.Tutor)
	}
}

export default MakeTutorService.execute()
