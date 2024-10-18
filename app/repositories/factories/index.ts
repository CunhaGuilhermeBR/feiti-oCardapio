import MakeApplicationRepository from './application'
import MakeConfigurableItemRepository from './configurableItem'
import MakeInterviewRepository from './interview'
import MakeInterviewQuestionRepository from './interviewQuestion'
import MakeSaleRepository from './sale'
import MakeTemplateRepository from './template'
import MakeSpeckResultRepository from './speckResult'
import MakeInterviewQuestionnaireRepository from './interviewQuestionnaire'
import MakeConfigQuestionRepository from './configQuestion'
import MakeConfigQuestionnaireRepository from './configQuestionnaire'
import MakeEmailRepository from './email'
import MakeConsentTermRepository from './consentTerm'
import MakeMoodleTaskRepository from './moodleTask'
import MakeFeedbackRepository from './feedback'
import MakeTutorRepository from './tutor'
import MakeMoodleSubmissionRepository from './moodleSubmission'
import MakeCourseRepository from './course'
import MakeRecommendationRepository from './recommendation'
import MakeConfigTCLERepository from './configTCLE'
import MakeConfigSpeckResultRepository from './configSpeckResult'
import MakeConfigTCLEFieldRepository from './configTCLEField'
import IRepositoryFactory from './types'

const RepositoryFactory: IRepositoryFactory = {
	Application: MakeApplicationRepository,
	ConfigQuestion: MakeConfigQuestionRepository,
	ConfigQuestionnaire: MakeConfigQuestionnaireRepository,
	ConfigurableItem: MakeConfigurableItemRepository,
	ConfigSpeckResult: MakeConfigSpeckResultRepository,
	ConfigTCLE: MakeConfigTCLERepository,
	ConfigTCLEField: MakeConfigTCLEFieldRepository,
	ConsentTerm: MakeConsentTermRepository,
	Course: MakeCourseRepository,
	Email: MakeEmailRepository,
	Feedback: MakeFeedbackRepository,
	Interview: MakeInterviewRepository,
	InterviewQuestionnaire: MakeInterviewQuestionnaireRepository,
	InterviewQuestion: MakeInterviewQuestionRepository,
	SpeckResult: MakeSpeckResultRepository,
	MoodleSubmission: MakeMoodleSubmissionRepository,
	MoodleTask: MakeMoodleTaskRepository,
	Recommendation: MakeRecommendationRepository,
	Sale: MakeSaleRepository,
	Template: MakeTemplateRepository,
	Tutor: MakeTutorRepository
}

export default RepositoryFactory
