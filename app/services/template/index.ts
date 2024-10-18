import { logger } from '@/infrastructure/logger'
import { TemplateRepository } from '@/repositories/template'
import { TemplateDTO, UpdateTemplateDTO } from './types'
import { ConfigTCLERepository } from '@/repositories/configTCLE'
import { NotFoundError } from '../errors'

export class TemplateService {
	private templateRepository: TemplateRepository
	private configTCLEReposiroty: ConfigTCLERepository
	private static instance: TemplateService

	public static getInstance(
		templateRepository: TemplateRepository,
		configTCLEReposiroty: ConfigTCLERepository) {
		if (!this.instance) {
			this.instance = new TemplateService(templateRepository, configTCLEReposiroty)
		}
		return this.instance
	}

	private constructor(
		templateRepository: TemplateRepository,
		configTCLEReposiroty: ConfigTCLERepository) {
		this.templateRepository = templateRepository
		this.configTCLEReposiroty = configTCLEReposiroty
	}

	public async findByName(name: string, url: string) {
		logger.info(`Finding Template ${name} on application ${url}`)
		return await this.templateRepository.findByName(name, url)
	}

	public async delete(id:string){
		logger.info(`Remove template from id ${id}`)
		return await this.templateRepository.delete(id)
	}

	public async create(data: TemplateDTO){
		logger.info(`Creating a new template with title ${data.title}`)
		if(!data.configTCLEId){
			const consentTerm = await this.configTCLEReposiroty.findByAppId(data.appId!)
			if(!consentTerm){
				throw new NotFoundError('ConfigTCLE', 'appId')
			}
			data.configTCLEId = consentTerm.id 
		}
		return await this.templateRepository.create(data)
	}

	public async update(data: UpdateTemplateDTO, id: string){
		logger.info(`Update template with id ${id}`)
		return await this.templateRepository.update(data, id)
	}

	public async findAll(){
		logger.info(`Finding all templates`)
		return await this.templateRepository.findAll()
	}

}
