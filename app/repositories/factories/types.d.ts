import { ApplicationRepository } from '@/repositories/application'
import { ConfigurableItemRepository } from '@/repositories/configurableItem'
import { InterviewRepository } from '@/repositories/interview'
import { SaleRepository } from '@/repositories/sale'
import { TemplateRepository } from '@/repositories/template'
import { SpeckResultRepository } from '@/repositories/speckResult'
import { InterviewQuestionnaireRepository } from '@/repositories/interviewQuestionnaire'
import { InterviewQuestionRepository } from '@/repositories/interviewQuestion'
import { ConfigQuestionRepository } from '@/repositories/configQuestion'
import { ConfigQuestionnaireRepository } from '@/repositories/configQuestionnaire'
import { EmailRepository } from '@/repositories/email'
import { ConsentTermRepository } from '@repositories/acceptTCLEFields'
import { MoodleTaskRepository } from '@repositories/moodleTask'
import { FeedbackRepository } from '@repositories/feedback'
import { TutorRepository } from '@repositories/tutor'
import { MoodleSubmissionRepository } from '@repositories/moodleSubmission'
import { CourseRepository } from '@repositories/course'
import { RecommendationRepository } from '@repositories/recommendation'
import { ConfigTCLERepository } from '@repositories/configTCLE'
import { ConfigSpeckResultRepository } from '@repositories/configSpeckResult'
import { ConfigTCLEFieldRepository } from '@repositories/configTCLEField'

interface IRepositoryFactory {
  Application: ApplicationRepository;
  ConfigQuestion: ConfigQuestionRepository;
  ConfigQuestionnaire: ConfigQuestionnaireRepository;
  ConfigSpeckResult: ConfigSpeckResultRepository
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
  Recommendation: RecommendationRepository,
  Sale: SaleRepository;
  SpeckResult: SpeckResultRepository;
  Template: TemplateRepository;
  Tutor: TutorRepository;
}

export default IRepositoryFactory
