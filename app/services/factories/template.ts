import RepositoryFactory from '@/repositories'
import { TemplateService } from '@/services/template'

class MakeTemplateService {
	private constructor() { }

	public static execute(): TemplateService {
		return TemplateService.getInstance(
			RepositoryFactory.Template,
			RepositoryFactory.ConfigTCLE)
	}
}

export default MakeTemplateService.execute()
