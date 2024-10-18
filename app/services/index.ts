import ServiceFactory from './factories'
import Services from './types'

const Services = {
	Application: ServiceFactory.Application,
	ConfigSpeckResult: ServiceFactory.ConfigSpeckResult,
	ConfigurableItem: ServiceFactory.ConfigurableItem,
	ConsentTerm: ServiceFactory.ConsentTerm,
	Course: ServiceFactory.Course,
	Email: ServiceFactory.Email,
	Feedback: ServiceFactory.Feedback,
	Recommendation: ServiceFactory.Recommendation,
	Interview: ServiceFactory.Interview,
	InterviewQuestion: ServiceFactory.InterviewQuestion,
	InterviewQuestionnaire: ServiceFactory.InterviewQuestionnaire,
	MoodleSubmission: ServiceFactory.MoodleSubmission,
	MoodleTask: ServiceFactory.MoodleTask,
	Sale: ServiceFactory.Sale,
	SpeckResult: ServiceFactory.SpeckResult,
	Template: ServiceFactory.Template,
	Tutor: ServiceFactory.Tutor
}

export default Services
