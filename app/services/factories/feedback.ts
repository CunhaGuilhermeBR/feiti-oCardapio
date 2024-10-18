import { FeedbackService } from '@/services/feedback'
import RepositoryFactory from '@/repositories'
import pdfGenerator from '@/infrastructure/pdfGenerator'
import CosDatasource from '@/infrastructure/datasources/cos'

class MakeFeedbackService {
	private constructor() {}

	public static execute(): FeedbackService {
		return FeedbackService.getInstance(
			RepositoryFactory.Feedback,
			RepositoryFactory.Email,
			RepositoryFactory.Tutor,
			pdfGenerator.getInstance(),
			CosDatasource.getInstance()
		)
	}
}

export default MakeFeedbackService.execute()
