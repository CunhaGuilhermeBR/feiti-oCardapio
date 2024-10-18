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
}
