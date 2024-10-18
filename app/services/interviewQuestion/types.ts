export interface InterviewQuestionDTO {
    index: number;
    question: string;
    questionnaireId: number;
    configQuestionId: number;
}

export interface UpdateInterviewQuestionDTO {
    index?: number;
    question?: string;
    questionnaireId?: number;
    configQuestionId?: number;
    configQuestion?: ConfigQuestion;
}

interface ConfigQuestion {
    minlength?: number;
    maxlength?: number;
}