import { Application } from 'express'
import MakeConfigurableItemController from './configurableItem'
import MakeInterviewController from './interview'
import MakeFeedbackController from './feedback'
import IControllerFactory from './types'
import MakeSelectQuestionnaireController from './selectQuestionnaire'
import MakeAuthenticationController from './authentication'
import MakeConsentTermController from './consentTerm'
import MakeTutorController from './tutor'
import MakeTermsController from './terms'
import MakeSelectPageController from './selectPage'
import MakeRecommendationController from './recommendation'
import MakeAdminController from './admin'

function ControllerFactory(application: Application): IControllerFactory {
	/* O MakeConfigurableItemController deve ser o último a ser executado, pois ele verifica
	 * no banco de dados o nome da página. Se a página for específica e não genérica,
	 * ele valida com base em um enumerador no banco. Caso não encontre a página no enumerador,
	 * ele retorna um erro, impedindo a renderização da página, mesmo que esteja declarada
	 * em outros controllers. */
	const Controllers: IControllerFactory = {
		Admin: MakeAdminController.execute(application),
		Authentication: MakeAuthenticationController.execute(application),
		ConsentTerm: MakeConsentTermController.execute(application),
		Feedback: MakeFeedbackController.execute(application),
		Interview: MakeInterviewController.execute(application),
		Recommendation: MakeRecommendationController.execute(application),
		SelectName: MakeSelectPageController.execute(application),
		SelectQuestionnaire: MakeSelectQuestionnaireController.execute(application),
		Tutor: MakeTutorController.execute(application),
		Terms: MakeTermsController.execute(application),
		/*LEIA O COMENTARIO DAS LINHAS 8-12*/
		ConfigurableItem: MakeConfigurableItemController.execute(application),
	}
	return Controllers
}

export default ControllerFactory
