export interface RecommendationData {
	name: string
	imageUrl: string | null
	description: string
}

export interface RecommendationPageRenderData {
	title: string
	logoUrl: string
	leaveButton: string
	recommendationCards: {
		imageUrl: string
		title: string
		description: string
	}[]
	starIcon: string
	buttonText: string
	spanInfo: string
	pBodyContent: string
}
