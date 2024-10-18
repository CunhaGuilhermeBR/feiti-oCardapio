import { ConfigurableItemController } from './index'
import { $Enums } from '@prisma/client'

export const Pages = $Enums.ConfigPageType

export interface IControllerFactory {
	ConfigurableItem: ConfigurableItemController
}

export interface PageRenderData {
	title: string
	imageUrl?: string | null
	description?: string
	videoUrl?: string | null
	iconUrl?: string
	logoImageUrl?: string
	nextPage?: string
	button?: string | null
	pdfFile?: Uint8Array
	headerText: string | null
}
