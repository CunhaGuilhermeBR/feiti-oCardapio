interface FeedbackTextArea {
	title: string
	textAreaTitle: string
	textAreaBody: string
	feedbackDate: string
	id: string
}

export interface FeedbackPageRenderData {
	title: string
	logoUrl: string
	leaveButton: string
	configFeedbackTextArea: {
		title: string
		textAreaTitle: string
		textAreaBody: string
		feedbackDate: string
		id: string
	}[]
}
