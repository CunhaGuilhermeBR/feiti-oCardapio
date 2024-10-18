import { CourseService } from '@/services/course'
import RepositoryFactory from '@/repositories'

class MakeCourseService {
	private constructor() {}

	public static execute(): CourseService {
		return CourseService.getInstance(
			RepositoryFactory.Course
		)
	}
}

export default MakeCourseService.execute()
