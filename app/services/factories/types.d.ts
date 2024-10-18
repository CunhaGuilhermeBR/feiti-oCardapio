import { ConfigurableItemService } from '@/services/configurableItem'
import { SaleService } from '@/services/sale'
import { InterviewService } from '@/services/interview'
import { SpeckResultService } from '@/services/speckResult'
import { InterviewQuestionnaireService } from '@/services/interviewQuestionnaire/interviewQuestionnaire'
import { InterviewQuestionService } from '@/services/interviewQuestion/interviewQuestion'
import { EmailService } from ' @/services/email'
import { ConsentTermService } from '@/services/consentTerm'
import { MoodleTaskService } from '@/services/moodleTask/moodleTask'
import { FeedbackService } from '@/services/feedback'
import { TutorService } from '@/services/tutor'
import { MoodleSubmissionService } from '@/services/moodleSubmission'
import { TemplateService } from '@/services/template'
import { CourseService } from '@/services/course'
import { RecommendationService } from '@/services/recommendation'
import { ConfigSpeckResultService } from '@/services/configSpeckResult'
import { ApplicationService } from '@/services/application'

interface ServiceFactory {
  Application: ApplicationService;
  ConfigSpeckResult: ConfigSpeckResultService;
  ConfigurableItem: ConfigurableItemService;
  ConsentTerm: ConsentTermService;
  Course: CourseService;
  Email: EmailService;
  Feedback: FeedbackService;
  Interview: InterviewService;
  InterviewQuestionnaire: InterviewQuestionnaireService;
  InterviewQuestion: InterviewQuestionService;
  MoodleSubmission: MoodleSubmissionService;
  MoodleTask: MoodleTaskService;
  Recommendation: RecommendationService;
  Sale: SaleService;
  SpeckResult: SpeckResultService;
  Template: TemplateService;
  Tutor: TutorService
}

export default ServiceFactory
