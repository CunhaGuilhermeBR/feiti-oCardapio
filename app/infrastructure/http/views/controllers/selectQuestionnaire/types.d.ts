interface Question {
    index: number;
    question: string;
    questionnaireId: number;
    configQuestionId: number;
  }
  
  interface ConfigurableItem {
    id: number;
    enabled: boolean;
    title: string;
    description: string;
    applicationId: number;
    createdat: string;
    updatedat: string;
    configPageType: string;
    index: number;
    imageUrl: string;
  }
  
  interface ConfigQuestionnaire {
    id: number;
    itemId: number;
    ConfigurableItem: ConfigurableItem;
  }
  
  interface Questionnaire {
    id: number;
    configQuestionnaireId: number;
    interviewQuestions: Question[];
    ConfigQuestionnaire: ConfigQuestionnaire;
  }

  interface ConfigInterviewQuestionnaire {
    title: string;
    description: string;
  }
  
export interface SelectQuestionnaireRenderData {
    title: string;
    description: string;
    listQuestionnaire: Questionnaire[];
    logoImageUrl: string;
    configInterviewQuestionnaire: ConfigInterviewQuestionnaire
  }
  