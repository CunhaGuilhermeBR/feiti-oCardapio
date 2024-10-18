import { NextFunction, Request, Response, Router } from 'express'
import { SaleService } from '@/services/sale'
import { EmailType } from '@/services/sale/types'
import { z } from 'zod'


export class EmailRouter {
	private router: Router
	private static instance: EmailRouter

	private saleSvc: SaleService

	static getInstance(
		saleSvc: SaleService
	): EmailRouter {
		if (!EmailRouter.instance) {
			EmailRouter.instance = new EmailRouter(
				saleSvc
			)
		}
		return EmailRouter.instance
	}

	private constructor(
		saleSvc: SaleService
	) {
		this.saleSvc = saleSvc
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
          
		this.setupRoutes()
	}

	/**
	 * @swagger
	 * /api/v1/admin/email/resend/{externalSaleId}/{emailType}:
	 *   post:
	 *     summary: Resend email to customer with the given external sale ID
	 *     description: Resend an email to a customer based on the provided external sale ID and email type.
	 *     tags:
	 *       - Admin
	 *     parameters:
	 *       - in: path
	 *         name: externalSaleId
	 *         required: true
	 *         description: External sale ID
	 *         schema:
	 *           type: string
	 *       - in: path
	 *         name: emailType
	 *         required: true
	 *         description: Email type
	 *         schema:
	 *          type: string
	 *          enum:
	 *           - SALE_ACCESS
	 *     responses:
	 *       '200':
	 *         description: OK. Email successfully resent.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *       '500':
	 *         description: Internal Server Error. Something went wrong on the server side.
	 */
	private async resend(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const externalSaleId = z.string().parse(req.params.externalSaleId)
			const emailType = z.nativeEnum(EmailType).parse(req.params.emailType)

			await this.saleSvc.resendAEmailToAExternalId(externalSaleId, emailType)
			
			res.status(200).json({ message: 'Email resent successfully' })
		} catch (error) {
			next(error)
		}
	}



	private setupRoutes(): void {
		this.router.post('/resend/:externalSaleId/:emailType', this.resend.bind(this))
	}

	public getRouter(): Router {
		return this.router
	}
}

export default EmailRouter.getInstance
