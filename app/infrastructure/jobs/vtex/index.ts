import Services from '@/services'
import { logger } from '@/infrastructure/logger'
import VtexWrapper from '@/infrastructure/datasources/vtex'

const loggerPrefix = 'JOB: VTEX'
const salesSvc = Services.Sale
const unwantedText = 'MG - Belo Horizonte - Speck - EAD - EAD'
const vtexWrapper: VtexWrapper = VtexWrapper.getInstance()

export async function executeVtexJob(): Promise<void> {
	try {
		logger.info(loggerPrefix)
		const ordersFeed = await vtexWrapper.getOrdersFromFeed()

		for (const orderF of ordersFeed) {
			await vtexWrapper.commitOrderInFeed(orderF.handle)
			const order = await vtexWrapper.getOrderData(orderF.orderId)
			await salesSvc.register({
				externalID: order.orderId,
				source: 'VTEX',
				url: process.env.VTEX_APP_URL,
				user: {
					email: order.clientProfileData.email,
					name: order.clientProfileData.firstName + ' ' + order.clientProfileData.lastName,
				},
				templates: order.itemMetadata.Items.map((item: { Name: string }) => {
					return item.Name.replace(unwantedText, '').trim()
				})
			})

		}

	} catch (error) {
		logger.error(loggerPrefix + ': ' + error)
		throw error
	}
}

