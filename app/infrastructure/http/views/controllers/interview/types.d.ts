interface InterviewQuestionnaire {
	title: string
	description: string
}

interface Question {
	index: number
	description: string
	minlength: number
	maxlength: number
}

interface Buttons {
	next: string
	nextRoute: string
	back: string
	backRoute: string
	isBackDisabled: boolean
	isNextDisabled: boolean
}

export interface InterviewPageRenderData {
	title: string
	logoImageUrl: string
	questionnaireId: number
	configInterviewQuestionnaire: InterviewQuestionnaire
	actualQuestionIndex: number
	buttons: Buttons
	listQuestion: Question[]
	interviewId: string
	saleId: string
	templateId: string
	url: string
	customerName: string
	customerEmail: string
	vocational: boolean
	headerText: string
}
