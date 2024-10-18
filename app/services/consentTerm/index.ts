import { logger } from '@/infrastructure/logger'
import { ConsentTermRepository } from '@/repositories/acceptTCLEFields'
import { TemplateRepository } from '@/repositories/template'
import { AcceptConsentTermDTO, ConsentTermDTO, ConsentTermFieldDTO, UpdateTermFieldDTO } from './types'
import { ConfigurableItemRepository } from '@/repositories/configurableItem'
import { NotCreatedError } from '../errors'
import { ConfigTCLERepository } from '@/repositories/configTCLE'
import { ConfigTCLEFieldRepository } from '@/repositories/configTCLEField'

export class ConsentTermService {
	private consentTermRepository: ConsentTermRepository
	private templateRepository: TemplateRepository
	private configurableItemRepository: ConfigurableItemRepository
	private configTCLERepository: ConfigTCLERepository
	private configTCLEFieldRepository: ConfigTCLEFieldRepository
	private static instance: ConsentTermService

	public static getInstance(
		consentTermRepository: ConsentTermRepository,
		templateRepository: TemplateRepository,
		configurableItemRepository: ConfigurableItemRepository,
		configTCLERepository: ConfigTCLERepository,
		configTCLEFieldRepository: ConfigTCLEFieldRepository
	) {
		if (!this.instance) {
			this.instance = new ConsentTermService(
				consentTermRepository,
				templateRepository,
				configurableItemRepository,
				configTCLERepository,
				configTCLEFieldRepository
			)
		}
		return this.instance
	}

	private constructor(
		consentTermRepository: ConsentTermRepository,
		templateRepository: TemplateRepository,
		configurableItemRepository: ConfigurableItemRepository,
		configTCLERepository: ConfigTCLERepository,
		configTCLEFieldRepository: ConfigTCLEFieldRepository
	) {
		this.consentTermRepository = consentTermRepository
		this.templateRepository = templateRepository
		this.configurableItemRepository = configurableItemRepository
		this.configTCLERepository = configTCLERepository
		this.configTCLEFieldRepository = configTCLEFieldRepository
	}

	public async create(data: AcceptConsentTermDTO) {
		logger.info(`Creating Accept consent term for body: ${data}`)
		const alreadyExists = await this.consentTermRepository.findBySaleId(data.saleId, data.ConfigConsentTermCheckFieldsId)
		if (!alreadyExists) {
			return await this.consentTermRepository.create(data)
		}
		return alreadyExists
	}

	public async findById(id: number){
		logger.info(`Finding config consent term fields by id: ${id}`)
		return await this.consentTermRepository.findById(id)
	}

	public async findConfigConsentTermFieldsByTemplateID(saleId: string, appUrl: string) {
		logger.info(`Finding config consent term fields by saleId: ${saleId} and appUrl: ${appUrl}`)
		const config = await this.templateRepository.findConfigConsertTermByTemplateID(saleId, appUrl)
		if (!config) {
			throw new Error('ConfigurableItem not found')
		}
		return config
	}

	public async createConsentTerm(data: ConsentTermDTO){
		if(!data.appId && !data.itemId){
			throw new NotCreatedError('Config Consent Term')
		}
		logger.info(`Consent term for item: ${data.itemId}`)
		if(!data.itemId && data.appId){
            const result = await this.configurableItemRepository.create({
				title: 'Termo de Consentimento Livre e Esclarecido',
				applicationId: data.appId,
				description: ''
			})
			data.itemId = result.id
		}
		return await this.configTCLERepository.create(data)
	}

	public async createConsentTermField(data: ConsentTermFieldDTO){
		logger.info(`Consent term field for item: ${data.itemId}`)
		if(!data.itemId){
			const result = await this.configurableItemRepository.create({
				title: 'Campo do Termo de Consentimento Livre e Esclarecido',
				applicationId: data.appId,
				description: data.description
			})
			data.itemId = result.id
		}
		return await this.configTCLEFieldRepository.create(data)
	}

	public async updateTermField(data: UpdateTermFieldDTO, id: number){
		logger.info(`Update consent term field for item: ${id}`)
		return await this.configurableItemRepository.update(data, id)
	}

	public async delete(id: number){
		logger.info(`Removing term for id: ${id}`)
		return await this.configTCLERepository.delete(id)
	}

	public async findAll(){
		logger.info(`Get all consent terms`)
		return await this.configTCLERepository.findAll()
	}
}