import { logger } from '@/infrastructure/logger'
import { ConfigSpeckResultRepository } from '@/repositories/configSpeckResult'
import { ConfigSpeckResultDTO, UpdateConfigSpeckResultDTO } from './types'
import { NotCreatedError, NotFoundError } from '../errors'
import { ConfigurableItemRepository } from '@/repositories/configurableItem'
import { $Enums } from '@prisma/client'
import { ApplicationRepository } from '@/repositories/application'

export class ConfigSpeckResultService {
    private configSpeckResultRepository: ConfigSpeckResultRepository
    private configurableItemRepository: ConfigurableItemRepository
    private applicationRepository: ApplicationRepository
    private static instance: ConfigSpeckResultService

    public static getInstance(
        configSpeckResultRepository: ConfigSpeckResultRepository,
        configurableItemRepository: ConfigurableItemRepository,
        applicationRepository: ApplicationRepository) {
        if (!this.instance) {
            this.instance = new ConfigSpeckResultService(
                configSpeckResultRepository,
                configurableItemRepository,
                applicationRepository)
        }
        return this.instance
    }

    private constructor(
        configSpeckResultRepository: ConfigSpeckResultRepository,
        configurableItemRepository: ConfigurableItemRepository,
        applicationRepository: ApplicationRepository) {
        this.configSpeckResultRepository = configSpeckResultRepository
        this.applicationRepository = applicationRepository
        this.configurableItemRepository = configurableItemRepository
    }

    public async delete(id: number) {
        logger.info(`Remove config speck result from id ${id}`)
        return await this.configSpeckResultRepository.delete(id)
    }

    public async create(data: ConfigSpeckResultDTO) {
        if (!data.itemId && !data.appId) {
            throw new NotCreatedError('Config speck result')
        }
        logger.info(`Creating a new config speck Result`)
        if (!data.itemId) {
            const app = await this.applicationRepository.findOneById(data.appId!)
            if (!app) {
                throw new NotFoundError('App', 'id')
            }
            const configurableItem = await this.configurableItemRepository.findOne($Enums.ConfigPageType.SPECKRESULT, app.url)
            if (!configurableItem) {
                throw new NotFoundError('Configurable Item', 'appId')
            }
            data.itemId = configurableItem.id
        }
        return await this.configSpeckResultRepository.create(data)
    }

    public async update(data: UpdateConfigSpeckResultDTO, id: number) {
        logger.info(`Update config speck result with id ${id}`)
        return await this.configSpeckResultRepository.update(data, id)
    }

    public async findAll(appId?: number) {
        logger.info(`Finding all configs speck result or try get by app ${appId}`)
        return await this.configSpeckResultRepository.findAll(appId)
    }

}
