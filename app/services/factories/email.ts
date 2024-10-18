import { EmailService } from '@/services/email'
import RepositoryFactory from '@/repositories'

class MakeEmailService {
	private constructor() {}

	public static execute(): EmailService {
		return EmailService.getInstance(
			RepositoryFactory.Email
		)
	}
}

export default MakeEmailService.execute()
