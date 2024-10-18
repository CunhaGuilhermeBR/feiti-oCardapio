import { logger } from '@/infrastructure/logger'
import { ApplicationRepository } from '@/repositories/application'
import { ApplicationDTO, UpdateApplicationDTO } from './types'

export class ApplicationService {
	private appRepository: ApplicationRepository
	private static instance: ApplicationService

	public static getInstance(
		appRepository: ApplicationRepository) {
		if (!this.instance) {
			this.instance = new ApplicationService(appRepository)
		}
		return this.instance
	}

	private constructor(
		appRepository: ApplicationRepository) {
		this.appRepository = appRepository
	}

	public async delete(id:number){
		logger.info(`Remove application from id ${id}`)
		return await this.appRepository.delete(id)
	}

	public async create(data: ApplicationDTO){
		logger.info(`Creating a new application with name ${data.name}`)
		return await this.appRepository.create(data)
	}

	public async update(data: UpdateApplicationDTO, id: number){
		logger.info(`Update application with id ${id}`)
		return await this.appRepository.update(data, id)
	}

	public async findAll(){
		logger.info(`Finding all applications`)
		return await this.appRepository.findAll()
	}

}
