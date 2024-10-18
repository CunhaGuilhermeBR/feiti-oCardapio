import MakeConfigurableItemService from './configurableItem'
import MakeSaleService from './sale'
import ServiceFactory from './types'
import MakeInterviewService from './interview'
import MakeSpeckResult from './speckResult'
import MakeInterviewQuestionnaire from './interviewQuestionnaire'
import MakeInterviewQuestion from './interviewQuestion'
import MakeEmailService from './email'
import MakeConsentTermService from './consentTerm'
import MakeMoodleTaskService from './moodleTask'
import MakeMoodleSubmissionService from './moodleSubmission'
import MakeFeedbackService from './feedback'
import MakeTutorService from './tutor'
import MakeTemplateService from './template'
import MakeCourseService from './course'
import MakeRecommendationService from './recommendation'
import MakeConfigSpeckResultService from './configSpeckResult'
import MakeApplicationService from './application'

const ServiceFactory: ServiceFactory = {
	Application: MakeApplicationService,
	ConfigSpeckResult: MakeConfigSpeckResultService,
	ConfigurableItem: MakeConfigurableItemService,
	ConsentTerm: MakeConsentTermService,
	Course: MakeCourseService,
	Email: MakeEmailService,
	Feedback: MakeFeedbackService,
	Interview: MakeInterviewService,
	InterviewQuestionnaire: MakeInterviewQuestionnaire,
	InterviewQuestion: MakeInterviewQuestion,
	MoodleSubmission: MakeMoodleSubmissionService,
	MoodleTask: MakeMoodleTaskService,
	Recommendation: MakeRecommendationService,
	Sale: MakeSaleService,
	SpeckResult: MakeSpeckResult,
	Template: MakeTemplateService,
	Tutor: MakeTutorService
}

export default ServiceFactory
