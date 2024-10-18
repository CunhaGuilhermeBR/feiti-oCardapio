import { ApplicationRepository } from './application'
import { ConfigurableItemRepository } from './configurableItem'
import { InterviewRepository } from './interview'
import { InterviewQuestionnaireRepository } from './interviewQuestionnaire'
import { SaleRepository } from './sale'
import { SpeckResultRepository } from './speckResult'
import { TemplateRepository } from './template'
import { InterviewQuestionRepository } from './interviewQuestion'
import { ConfigQuestionRepository } from './configQuestion'
import { ConfigQuestionnaireRepository } from './configQuestionnaire'
import { EmailRepository } from './email'
import { ConsentTermRepository } from './acceptTCLEFields'
import { MoodleTaskRepository } from './moodleTask'
import { FeedbackRepository } from './feedback'
import { TutorRepository } from './tutor'
import { MoodleSubmissionRepository } from './moodleSubmission'
import { RecommendationRepository } from './recommendation'
import { ConfigTCLERepository } from './configTCLE'
import { ConfigSpeckResultRepository } from './configSpeckResult'
import { ConfigTCLEFieldRepository} from './configTCLEField'

interface Repositories {
  Application: ApplicationRepository;
  ConfigQuestion: ConfigQuestionRepository;
  ConfigQuestionnaire: ConfigQuestionnaireRepository;
  ConfigSpeckResult: ConfigSpeckResultRepository;
  ConfigTCLE: ConfigTCLERepository;
  ConfigTCLEField: ConfigTCLEFieldRepository;
  ConfigurableItem: ConfigurableItemRepository;
  ConsentTerm: ConsentTermRepository;
  Course: CourseRepository;
  Email: EmailRepository;
  Feedback: FeedbackRepository;
  Interview: InterviewRepository;
  InterviewQuestionnaire: InterviewQuestionnaireRepository;
  InterviewQuestion: InterviewQuestionRepository;
  MoodleSubmission: MoodleSubmissionRepository;
  MoodleTask: MoodleTaskRepository;
  Recommendation: RecommendationRepository
  Sale: SaleRepository;
  SpeckResult: SpeckResultRepository;
  Template: TemplateRepository;
  Tutor: TutorRepository;
  
}

export default Repositories
