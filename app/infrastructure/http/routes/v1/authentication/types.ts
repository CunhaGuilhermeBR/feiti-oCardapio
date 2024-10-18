import { z } from 'zod'

const Address3Schema = z
	.object({
		id: z.string().optional(),
		tag: z.string().optional(),
		address: z
			.object({
				subdivisions: z.array(z.any().optional()).optional(),
				city: z.string().optional(),
				countryFullname: z.string().optional(),
				addressLine: z.string().optional(),
				formattedAddress: z.string().optional(),
				country: z.string().optional(),
				postalCode: z.string().optional(),
			})
			.optional(),
	})
	.optional()

const EmailSchema = z
	.object({
		id: z.string().optional(),
		tag: z.string().optional(),
		email: z.string().optional(),
		primary: z.boolean().optional(),
	})
	.optional()

const PhoneSchema = z
	.object({
		tag: z.string().optional(),
		formattedPhone: z.string().optional(),
		id: z.string().optional(),
		primary: z.boolean().optional(),
		phone: z.string().optional(),
	})
	.optional()

export const ContactSchema = z.object({
	name: z
		.object({
			first: z.string().optional(),
			last: z.string().optional(),
		})
		.optional(),
	email: z.string().optional(),
	locale: z.string().optional(),
	phones: z.array(PhoneSchema.optional()).optional(),
	address: Address3Schema.optional(),
	emails: z.array(EmailSchema.optional()).optional(),
	phone: z.string().optional(),
	addresses: z
		.array(
			z.object({
				id: z.string().optional(),
				tag: z.string().optional(),
				address: Address3Schema.optional(),
			})
		)
		.optional(),
})
const BillingInfoSchema = z.object({
	address: z
		.object({
			countryFullname: z.string().optional(),
			subdivisionFullname: z.string().optional(),
			country: z.string().optional(),
			postalCode: z.string().optional(),
			subdivision: z.string().optional(),
		})
		.optional(),
	contactDetails: z
		.object({
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			phone: z.string().optional(),
		})
		.optional(),
})

const LineItemSchema = z
	.object({
		quantity: z.number().optional(),
		sku: z.string().optional(),
		image: z.string().optional(),
		totalPriceBeforeTax: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		taxRate: z.string().optional(),
		shippable: z.boolean().optional(),
		totalPrice: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		catalogItemId: z.string().optional(),
		taxAmount: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		totalDiscount: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		id: z.string().optional(),
		itemType: z.string().optional(),
		catalogId: z.string().optional(),
		itemName: z.string().optional(),
		descriptionLines: z.array(z.any().optional()).optional(),
	})
	.optional()

const PriceSummarySchema = z
	.object({
		tax: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		total: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		subtotal: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		discount: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		shipping: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
	})
	.optional()

const ContextSchema = z
	.object({
		metaSiteId: z.string().optional(),
		activationId: z.string().optional(),
	})
	.optional()

const Context2Schema = z
	.object({
		activation: z
			.object({
				id: z.string().optional(),
			})
			.optional(),
		configuration: z
			.object({
				id: z.string().optional(),
			})
			.optional(),
		app: z.object({
			id: z.string(),
		}),
		action: z
			.object({
				id: z.string().optional(),
			})
			.optional(),
		trigger: z
			.object({
				key: z.string().optional(),
			})
			.optional(),
	})
	.optional()

const AppliedDiscountSchema = z
	.object({
		discountType: z.string().optional(),
		coupon: z
			.object({
				id: z.string().optional(),
				code: z.string().optional(),
				name: z.string().optional(),
				amount: z
					.object({
						value: z.string().optional(),
						currency: z.string().optional(),
					})
					.optional(),
			})
			.optional(),
		lineItemIds: z.array(z.string().optional()).optional(),
		amount: z
			.object({
				value: z.string().optional(),
				currency: z.string().optional(),
			})
			.optional(),
		discountName: z.string().optional(),
		discountSourceType: z.string().optional(),
	})
	.optional()

const BalanceSummarySchema = z.object({
	balance: z
		.object({
			value: z.string().optional(),
			currency: z.string().optional(),
		})
		.optional(),
	paid: z
		.object({
			value: z.string().optional(),
			currency: z.string().optional(),
		})
		.optional(),
	refunded: z
		.object({
			value: z.string().optional(),
			currency: z.string().optional(),
		})
		.optional(),
})

export const WixStoreSchema = z.object({
	data: z.object({
		invoices: z.array(z.any().optional()).optional(),
		payments: z.array(z.any().optional()).optional(),
		orderNumber: z.string().optional(),
		purchaseFlowId: z.string().optional(),
		cartId: z.string().optional(),
		lineItems: z.array(LineItemSchema.optional()).optional(),
		paymentStatus: z.string().optional(),
		refunds: z.array(z.any()).optional(),
		context: ContextSchema.optional(),
		channelType: z.string().optional(),
		checkoutCustomFields: z.object({}).optional(),
		_context: Context2Schema.optional(),
		appliedDiscounts: z.array(AppliedDiscountSchema.optional()).optional(),
		attributionSource: z.string().optional(),
		contact: ContactSchema.optional(),
		weightUnit: z.string().optional(),
		priceSummary: PriceSummarySchema.optional(),
		id: z.string().optional(),
		buyerEmail: z.string().optional(),
		status: z.string().optional(),
		contactId: z.string().optional(),
		billingInfo: BillingInfoSchema.optional(),
		fulfillmentStatusesAggregate: z.array(z.any().optional()).optional(),
		catalogs: z.array(z.string().optional()).optional(),
		currency: z.string().optional(),
		balanceSummary: BalanceSummarySchema.optional(),
		checkoutId: z.string().optional(),
		buyerLanguage: z.string().optional(),
		createdDate: z.string().optional(),
	}),
})

export const LoginTutorSchema = z.object({
	email: z.string().email(),
	password: z.string()
})