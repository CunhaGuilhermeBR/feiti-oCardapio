import RepositoryFactory from './factories'
import Repositories from './types'

const Repositories: Repositories = {
	Application: RepositoryFactory.Application,
	ConfigQuestion: RepositoryFactory.ConfigQuestion,
	ConfigQuestionnaire: RepositoryFactory.ConfigQuestionnaire,
	ConfigSpeckResult: RepositoryFactory.ConfigSpeckResult,
	ConfigTCLE: RepositoryFactory.ConfigTCLE,
	ConfigTCLEField: RepositoryFactory.ConfigTCLEField,
	ConfigurableItem: RepositoryFactory.ConfigurableItem,
	ConsentTerm: RepositoryFactory.ConsentTerm,
	Course: RepositoryFactory.Course,
	Email: RepositoryFactory.Email,
	Feedback: RepositoryFactory.Feedback,
	Interview: RepositoryFactory.Interview,
	InterviewQuestionnaire: RepositoryFactory.InterviewQuestionnaire,
	InterviewQuestion: RepositoryFactory.InterviewQuestion,
	MoodleSubmission: RepositoryFactory.MoodleSubmission,
	MoodleTask: RepositoryFactory.MoodleTask,
	Recommendation: RepositoryFactory.Recommendation,
	Sale: RepositoryFactory.Sale,
	SpeckResult: RepositoryFactory.SpeckResult,
	Template: RepositoryFactory.Template,
	Tutor: RepositoryFactory.Tutor
}

export default Repositories
