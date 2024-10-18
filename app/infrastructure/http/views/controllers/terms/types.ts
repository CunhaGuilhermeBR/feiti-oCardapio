import { $Enums } from '@prisma/client'

export const Pages = $Enums.ConfigPageType

export interface TermsPageRenderData {
	title: string
	content: string
	// acceptConsentLabel: string
	// acceptPrivacyLabel: string
	saleId: string
	accept: boolean
	// configConsentTermCheckFieldsId: number
	termCheckFields: ConsentTermCheckFields[]
	nextPage: string
}

interface ConsentTermCheckFields {
	id: number
	label: string
}