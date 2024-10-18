import { VTEXError } from './error'
import { Order, OrderFeed } from './types'

export default class VtexWrapper {
	private static instance: VtexWrapper

	static getInstance() {
		if (!VtexWrapper.instance) {
			VtexWrapper.instance = new VtexWrapper()
		}
		return VtexWrapper.instance
	}

	constructor() { }

	public async getOrdersFromFeed(maxlot: number = 10): Promise<OrderFeed[]> {
		const params = new URLSearchParams({
			'maxlot': maxlot.toString()
		})

		const data = await this.fetchVtex(`/api/orders/feed?${params}`)
		return data as OrderFeed[]
	}

	public async getOrderData(orderId: string): Promise<Order> {
		const data = await this.fetchVtex(`/api/oms/pvt/orders/${orderId}`)
		return data as Order
	}

	public async commitOrderInFeed(handle: string): Promise<void> {
		const body = {
			handles: [handle],
		}
		await this.fetchVtex('/api/orders/feed', 'POST', JSON.stringify(body))
	}

	private async fetchVtex(route: string, method: string = 'GET', body?: BodyInit) {
		const options: RequestInit = {
			method,
			body,
			headers: {
				'X-VTEX-API-AppKey': process.env.VTEX_APP_KEY,
				'X-VTEX-API-AppToken': process.env.VTEX_APP_TOKEN,
				'Content-Type': 'application/json',
			} as HeadersInit
		}

		const response = await fetch(process.env.VTEX_URL + route, options)
		if (!response.ok) {
			throw new VTEXError(response.statusText)
		}

		try {
			return await response.json()
		} catch (error) {
			return
		}
	}
}