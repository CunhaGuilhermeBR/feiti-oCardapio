export interface ProductDTO {
    name: string
	description?:string
	price: string
	options?:string[]
	categoryId: string
}

export interface UpdateProductDTO {
    name?: string
	description?:string
	price?: string
	options?:string[]
	categoryId?: string
}

