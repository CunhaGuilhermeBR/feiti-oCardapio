import { ApplicationRepository } from '@/repositories/application'
import { ConfigurableItemRepository } from '@/repositories/configurableItem'
import { NotFoundError } from '@/services/errors'
import { logger } from '@/infrastructure/logger'
import { $Enums } from '@prisma/client'
import zod from 'zod'
import { ConfigurableItemDTO, UpdateConfigurableItemDTO } from './types'


export class ConfigurableItemService {
	private applicationRepository: ApplicationRepository
	private configurableItemRepository: ConfigurableItemRepository
	private pageTypeEnum = zod.nativeEnum($Enums.ConfigPageType)
	private static instance: ConfigurableItemService

	public static getInstance(
		applicationRepository: ApplicationRepository,
		configurableItemRepository: ConfigurableItemRepository
	) {
		if (!this.instance) {
			this.instance = new ConfigurableItemService(
				applicationRepository,
				configurableItemRepository
			)
		}
		return this.instance
	}

	private constructor(
		applicationRepository: ApplicationRepository,
		configurableItemRepository: ConfigurableItemRepository
	) {
		this.applicationRepository = applicationRepository
		this.configurableItemRepository = configurableItemRepository
	}

	public async findOne(pageType: string, url: string) {
		logger.info(
			`Finding Configurable item for pageType: ${pageType} and url: ${url}`
		)
		const parsedPageType = this.pageTypeEnum.safeParse(pageType.toUpperCase())
		if (!parsedPageType.success) {
			logger.error(parsedPageType.error)
			throw parsedPageType.error
		}

		const result = await this.configurableItemRepository.findOne(
			parsedPageType.data,
			url
		)
		if (!result) {
			throw new NotFoundError('ConfigurableItem', 'pageType')
		}

		return result
	}

	public async findAllByApplication(url: string) {
		logger.info(
			`Finding All Configurable item for url: ${url}`
		)
		const result = await this.configurableItemRepository.findAll(
			url
		)
		if (!result) {
			throw new NotFoundError('ConfigurableItem', 'AppId')
		}
		return result
	}

	public async create(data: ConfigurableItemDTO) {
		logger.info(`Creating Configurable item for body: ${data}`)
		const application = await this.applicationRepository.findOneByURL(data.url!)
		if (!application) {
			throw new NotFoundError('Application', 'url')
		}
		data.applicationId = application.id
		return await this.configurableItemRepository.create(data)
	}

	public async update(data: UpdateConfigurableItemDTO, id: number) {
		logger.info(`Update Configurable item for id: ${id}`)
		const exists = await this.configurableItemRepository.findById(id)
		if (!exists) {
			throw new NotFoundError('Configurable item', 'id')
		}
		return await this.configurableItemRepository.update(data, id)
	}

	public async delete(id: number) {
		logger.info(`Removing Configurable item for id: ${id}`)
		return await this.configurableItemRepository.delete(id)
	}
}