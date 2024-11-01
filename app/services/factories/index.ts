import MakeProductService from './product'
import MakeCategoryService from './category'
import ServiceFactory from './types'

const ServiceFactory: ServiceFactory = {
	Category: MakeCategoryService,
	Product: MakeProductService
}

export default ServiceFactory
