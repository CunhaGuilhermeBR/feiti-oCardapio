import { feedbackTemplate } from './feedbackTemplate'
import { experienceTemplate } from './experienceTemplate'
import { Template } from '@pdfme/common'

export const templates: Templates = {
	feedbackTemplate,
	experienceTemplate
}

export type Templates = {
    [key: string]: Template
}

