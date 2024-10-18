import { NextFunction, Request, Response, Router } from 'express'
import { logger } from '@/infrastructure/logger'
import { ConsentTermService } from '@/services/consentTerm'
import zod from 'zod'
import { TCLECreateSchema, TCLEUpdateSchema } from './types'
import { NotFoundError } from '@/services/errors'

export class ConsentTermRouter {
	private consentTermSvc: ConsentTermService
	private router: Router

	private static instance: ConsentTermRouter

	static getInstance(consentTermSvc: ConsentTermService): ConsentTermRouter {
		if (!ConsentTermRouter.instance) {
			ConsentTermRouter.instance = new ConsentTermRouter(consentTermSvc)
		}
		return ConsentTermRouter.instance
	}

	private constructor(consentTermSvc: ConsentTermService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.consentTermSvc = consentTermSvc
		this.setupRoutes()
	}

	/**
	 * @swagger
	 *
	 * /api/v1/terms/accept/{saleId}/field/{configConsentTermCheckFieldsId}:
	 *   post:
	 *     summary: Accept terms and conditions
	 *     description: Endpoint to accept terms and conditions.
	 *     tags:
	 *       - Terms
	 *     parameters:
	 *       - in: path
	 *         name: saleId
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Sale ID
	 *       - in: path
	 *         name: configConsentTermCheckFieldsId
	 *         required: true
	 *         schema:
	 *           type: string
	 *           description: Config Consent Term Check Fields ID
	 *     responses:
	 *       '200':
	 *         description: Terms and conditions accepted successfully.
	 *       '400':
	 *         description: Bad Request. Invalid input parameters.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *                   example: Invalid saleId or configConsentTermCheckFieldsId.
	 *       '500':
	 *         description: Internal Server Error. Something went wrong on the server side.
	 */
	private async acceptTerms(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const saleId = zod.string().parse(req.params.saleId)
			const configConsentTermCheckFieldsId = zod.number().parse(+req.params.configConsentTermCheckFieldsId)

			await this.consentTermSvc.create({
				saleId: saleId,
				ConfigConsentTermCheckFieldsId: configConsentTermCheckFieldsId,
			})

			logger.info('Terms and conditions accepted')

			res.status(200).json({
				message: 'Terms and conditions accepted',
			})

		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/terms/consentTerm:
  *   post:
  *     summary: Create a new TCLE (Termo de Consentimento Livre e Esclarecido)
  *     description: Create a new TCLE with the provided data, including associated fields.
  *     tags:
  *       - TCLE
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/TCLECreateRequestBody'
  *     responses:
  *       201:
  *         description: Successfully created TCLE
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/TCLEResponse'
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TCLECreateRequestBody:
  *       type: object
  *       properties:
  *         appId:
  *           type: integer
  *           description: The ID of the associated application
  *         itemId:
  *           type: integer
  *           description: The optional ID of the TCLE item
  *         items:
  *           type: array
  *           items:
  *             $ref: '#/components/schemas/TCLEField'
  *     TCLEField:
  *       type: object
  *       properties:
  *         description:
  *           type: string
  *           description: Description of the consent term field
  *     TCLEResponse:
  *       type: object
  *       properties:
  *         id:
  *           type: integer
  *           description: The ID of the created TCLE
  *         appId:
  *           type: integer
  *         items:
  *           type: array
  *           items:
  *             $ref: '#/components/schemas/TCLEField'
  *         createdAt:
  *           type: string
  *           format: date-time
  *           description: The date and time when the TCLE was created
  */
	private async createTCLE(req: Request, res: Response, next: NextFunction) {
		try {
			const data = TCLECreateSchema.parse(req.body)
			const result = await this.consentTermSvc.createConsentTerm(data)
			if (data.items && data.items.length > 0) {
				for (const field of data.items) {
					await this.consentTermSvc.createConsentTermField({
						description: field.description,
						appId: data.appId,
						consentTermId: result.id
					})
				}
			}
			res.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}


	/**
  * @swagger
  * /api/v1/term-field/{id}:
  *   put:
  *     summary: Update an existing term field
  *     description: Update a specific term field by its ID with the provided data.
  *     tags:
  *       - TermField
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: The ID of the term field to update
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/TCLEUpdateRequestBody'
  *     responses:
  *       200:
  *         description: Successfully updated the term field
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Term field not found
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TCLEUpdateRequestBody:
  *       type: object
  *       properties:
  *         description:
  *           type: string
  *           description: The updated description for the term field
  */
	private async updateTermField(req: Request, res: Response, next: NextFunction) {
		try {
			const data = TCLEUpdateSchema.parse(req.body)
			const id = zod.number().parse(+req.params.id)
			const result = await this.consentTermSvc.updateTermField(data, id)
			if (!result) {
				throw new NotFoundError('Term field', 'id')
			}
			return res.status(200).send()
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/term-field/{id}:
  *   delete:
  *     summary: Delete a term field
  *     description: Delete a specific term field by its ID.
  *     tags:
  *       - TermField
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: The ID of the term field to delete
  *     responses:
  *       200:
  *         description: Successfully deleted the term field
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Term field not found
  *       500:
  *         description: Internal Server Error
  */
	private async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().parse(+req.params.id)
			await this.consentTermSvc.delete(id)
			return res.status(200).send()
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/term-fields:
  *   get:
  *     summary: Get all term fields
  *     description: Retrieve a list of all term fields.
  *     tags:
  *       - TermField
  *     responses:
  *       200:
  *         description: A list of term fields
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/TCLETermField'
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TCLETermField:
  *       type: object
  *       properties:
  *         id:
  *           type: integer
  *           description: The ID of the term field
  *         description:
  *           type: string
  *           description: The description of the term field
  *         createdAt:
  *           type: string
  *           format: date-time
  *           description: The date and time the term field was created
  */
	private async findAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.consentTermSvc.findAll()
			return res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/term-field/{id}:
  *   get:
  *     summary: Get a term field by ID
  *     description: Retrieve a specific term field by its ID.
  *     tags:
  *       - TermField
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: The ID of the term field to retrieve
  *     responses:
  *       200:
  *         description: Successfully retrieved the term field
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/TCLETermField'
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Term field not found
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TCLETermField:
  *       type: object
  *       properties:
  *         id:
  *           type: integer
  *           description: The ID of the term field
  *         description:
  *           type: string
  *           description: The description of the term field
  *         createdAt:
  *           type: string
  *           format: date-time
  *           description: The date and time the term field was created
  */
	private async findById(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().parse(+req.params.id)
			const result = await this.consentTermSvc.findById(id)
			return res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes(): void {
		this.router.post('/accept/:saleId/field/:configConsentTermCheckFieldsId', this.acceptTerms.bind(this))
		this.router.post('/', this.createTCLE.bind(this))
		this.router.patch('/:id', this.updateTermField.bind(this))
		this.router.delete('/:id', this.delete.bind(this))
		this.router.get('/', this.findAll.bind(this))
		this.router.get('/:id', this.findById.bind(this))
	}

	public getRouter(): Router {
		return this.router
	}
}

export default ConsentTermRouter.getInstance
