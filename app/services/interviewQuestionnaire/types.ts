export interface InterviewQuestionnaireDTO {
    configQuestionnaireId: number;
}

export interface UpdateInterviewQuestionnaireDTO {
    configQuestionnaireId?: number;
    configurableItem?: ConfigurableItem
}

interface ConfigurableItem {
    title?: string,
    description?: string,
    imageUrl?: string,
}