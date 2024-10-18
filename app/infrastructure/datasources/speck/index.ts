import { logger } from '@/infrastructure/logger'
import { SpeckError, SpeckBadRequestError } from './errors'
import { ConfigSpeckResult } from '@prisma/client'
import { GenerateReport, ReportDataResponse, SendSampleBody, SendSampleInput, SendSampleResponse, SpeckApiResponse, SpeckResponse } from './types'

export default class SpeckWrapper {
	private static instance: SpeckWrapper

	static getInstance(

	) {
		if (!SpeckWrapper.instance) {
			SpeckWrapper.instance = new SpeckWrapper()
		}
		return SpeckWrapper.instance
	}

	constructor() { }

	public async sendSample(configSpeckResult: ConfigSpeckResult, sendSampleInput: SendSampleInput) {
		logger.info('Getting answers from interview ID:', sendSampleInput.interview.id)
		const sample: string = sendSampleInput.interview.InterviewAnswers.map((r) => r.answer).join(' ')

		const requestBody: SendSampleBody = {
			reference: sendSampleInput.customerName,
			sample: sample,
			includes: sendSampleInput.vocational ? ['vocational'] : null
		}

		const options: RequestInit = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				token: configSpeckResult.speckApiToken,
				origin: configSpeckResult.speckOrigin
			} as HeadersInit,
			body: JSON.stringify(requestBody)
		}

		return await this.fetchSpeck(options, '/essay', configSpeckResult) as SpeckResponse<SendSampleResponse>

		// const response = await this.fetchSpeck(options, '/essay', configSpeckResult) as SpeckResponse<any>

		// return await this.getReportPDF(response.data.essayId, sendSampleInput.interview.templateId, configSpeckResult)

	}

	public async getReportPDF(essayId: string, templateId: string, configSpeckResult: ConfigSpeckResult) {
		const requestBody: GenerateReport = {
			template: templateId,
			essayId
		}

		const options: RequestInit = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				token: configSpeckResult.speckApiToken,
				origin: configSpeckResult.speckOrigin
			} as HeadersInit,
			body: JSON.stringify(requestBody)
		}

		return await this.fetchSpeck(options, '/report/pdf', configSpeckResult) as SpeckResponse<any>
	}

	public async getReportData(essayId: string, templateId: string, configSpeckResult: ConfigSpeckResult) {
		const requestBody: GenerateReport = {
			template: templateId,
			essayId
		}

		const options: RequestInit = {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				accept: 'application/json',
				token: configSpeckResult.speckApiToken,
				origin: configSpeckResult.speckOrigin
			} as HeadersInit,
			body: JSON.stringify(requestBody)
		}

		return await this.fetchSpeck(options, '/report/data', configSpeckResult) as SpeckResponse<SpeckApiResponse>
	}

	private async fetchSpeck(
		options: RequestInit,
		route: string,
		configSpeckResult: ConfigSpeckResult
	): Promise<SpeckResponse<unknown>> {
		logger.info(`Try to fetch speck on route:${route}`)
		const response = await fetch(configSpeckResult.speckUrl + route, options)

		if (!response.ok) {

			if (response.status === 400) { 
				throw new SpeckBadRequestError()
			}

			throw new SpeckError(response.status, response.statusText)
		}

		const data = await response.json() as SpeckResponse<unknown>
		data.timestamps = new Date(data.timestamps)

		return data
	}
}
