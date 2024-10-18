import { Body } from 'ibm-cos-sdk/clients/s3'
import { S3 } from 'ibm-cos-sdk'
import { logger } from '@/infrastructure/logger'
import { COSError } from './errors'

export default class CosDatasource {
	private static instance: CosDatasource
	private endpoint: string
	private apiKey: string
	private serviceInstance: string
	private bucket: string
	private cos: S3

	static getInstance() {
		if (!CosDatasource.instance) {
			CosDatasource.instance = new CosDatasource()
		}
		return CosDatasource.instance
	}

	constructor() {
		this.apiKey = process.env.COS_API_KEY
		this.bucket = process.env.COS_BUCKET
		this.endpoint = process.env.COS_ENDPOINT
		this.serviceInstance = process.env.COS_SERVICE_INSTANCE
		this.cos = new S3({
			endpoint: this.endpoint,
			apiKeyId: this.apiKey,
			serviceInstanceId: this.serviceInstance,
		})
	}

	public async createObject(key: string, body: Body) {
		logger.info('Try to create object in COS:', key)
		const object = await this.cos
			.putObject({
				Bucket: this.bucket,
				Key: key,
				Body: body,
			})
			.promise()

		if (object.$response.error) {
			throw new COSError(this.bucket, object.$response.error.message)
		}

		return encodeURI(`https://${this.bucket}.${this.endpoint}/${key}`)

	}

}
