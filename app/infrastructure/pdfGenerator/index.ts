import { generate } from '@pdfme/generator'
import { PDFData } from './types'
import { readFileSync } from 'node:fs'
import path from 'path'
import { GeneratorOptions, Template } from '@pdfme/common'
import { NotFoundError } from '@/services/errors'
import { templates } from './templates/index'

export default class pdfGenerator {
	private static instance: pdfGenerator
	private options: GeneratorOptions

	static getInstance(

	) {
		if (!pdfGenerator.instance) {
			pdfGenerator.instance = new pdfGenerator()
		}
		return pdfGenerator.instance
	}

	constructor() {
		this.options = {
			font: {
				vag_rounded_std: {
					data: readFileSync(
						path.join(
							process.cwd(),
							'app', 'infrastructure', 'pdfGenerator', 'fonts', 'VAGRoundedStd', 'VAGRoundedStdBlack.otf'
						)
					),
				},
				barlow_condensed_regular: {
					data: readFileSync(
						path.join(
							process.cwd(),
							'app', 'infrastructure', 'pdfGenerator', 'fonts', 'BarlowCondensed', 'BarlowCondensed-Regular.ttf'
						)
					),
					fallback: true,
				},
				barlow_condensed_medium: {
					data: readFileSync(
						path.join(
							process.cwd(),
							'app', 'infrastructure', 'pdfGenerator', 'fonts', 'BarlowCondensed', 'BarlowCondensed-Medium.ttf'
						)

					),
				},
			},
		}
	}


	public async generatePdf<T extends PDFData>(data: T, templateName: string): Promise<Uint8Array> {
		const template = this.getTemplate(templateName)
		if (!template) {
			throw new NotFoundError('PdfTemplate', templateName)
		}
		const inputs = [{ ...data }]
		return await generate({ template, inputs, options: this.options })
	}

	private getTemplate(templateName: string): Template | null {
		return templates[templateName] || null
	}

}