import { ConfigurableItemService } from './configurableItem'
import { ConsentTermService } from './consentTerm'
import { EmailService } from './email'
import { FeedbackService } from './feedback'
import { InterviewService } from './interview'
import { InterviewQuestionService } from './interviewQuestion'
import { InterviewQuestionnaireService } from './interviewQuestionnaire'
import { MoodleSubmissionService } from './moodleSubmission'
import { MoodleTaskService } from './moodleTask'
import { SaleService } from './sale'
import { SpeckResultService } from './speckResult'
import { TemplateService } from './template'
import { TutorService } from './tutor'
import { RecommendationService } from './recommendation'
import { CourseService } from './course'
import { ConfigSpeckResultService } from './configSpeckResult'
import { ApplicationService } from './application'

interface Services {
  ApplicationService: ApplicationService,
  ConfigSpeckResult: ConfigSpeckResultService
  ConfigurableItem: ConfigurableItemService;
  ConsentTerm: ConsentTermService;
  Course: CourseService
  Email: EmailService;
  Feedback: FeedbackService;
  Interview: InterviewService;
  InterviewQuestionnaire: InterviewQuestionnaireService;
  InterviewQuestion: InterviewQuestionService;
  MoodleSubmission: MoodleSubmissionService;
  MoodleTask: MoodleTaskService;
  Service: SaleService;
  SpeckResult: SpeckResultService;
  Template: TemplateService;
  Tutor: TutorService
}

export default Services
