import { ConfigurableItemService } from '@/services/configurableItem'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'
import { ConfigurableItemSchema, UpdateConfigurableItemSchema } from './types'

export class ConfigurableItemRouter {
	private configurableItemSvc: ConfigurableItemService
	private router: Router

	private static instance: ConfigurableItemRouter

	static getInstance(configurableItemSvc: ConfigurableItemService): ConfigurableItemRouter{
		if (!ConfigurableItemRouter.instance) {
			ConfigurableItemRouter.instance = new ConfigurableItemRouter(
				configurableItemSvc
			)
		}
		return ConfigurableItemRouter.instance
	}

	private constructor(configurableItemSvc: ConfigurableItemService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.configurableItemSvc = configurableItemSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
   * @swagger
   * /api/v1/configurableItem/{page}:
   *   get:
   *     summary: Get configurable item by page name and app id.
   *     description: Get configurable item by page name and app id.
   *     tags:
   *       - Configurable Item
   *     parameters:
   *       - in: path
   *         name: page
   *         required: true
   *         schema:
   *           type: string
   *         description: Page name
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
	private async getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const url = zod.string().parse(req.headers.host)
			const page = zod.string().parse(req.params.page).toUpperCase()
			const result = await this.configurableItemSvc.findOne(page, url)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/configurableItem:
 *   get:
 *     summary: Get all configurable items by application url.
 *     description: Get all configurable items by application url.
 *     tags:
 *       - Configurable Item
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
	private async getAllByApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const url = zod.string().parse(req.headers.host)
			const result = await this.configurableItemSvc.findAllByApplication(url)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	/**
 * @swagger
 * components:
 *   schemas:
 *     ConfigurableItemRequestBody:
 *       type: object
 *       properties:
 *         enabled:
 *           type: boolean
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         applicationId:
 *           type: integer
 *         createdat:
 *           type: string
 *           format: date-time
 *         updatedat:
 *           type: string
 *           format: date-time
 *         configPageType:
 *           type: string
 *           enum:
 *             - INSTRUCTIONS
 *             - HOWITWORKS
 *             - PRESENTATION
 *             - ITEM
 *             - SPECKRESULT
 *             - INTERVIEW
 *         index:
 *           type: integer
 *         imageUrl:
 *           type: string
 *           format: uri
 *     ConfigurableItem:
 *       allOf:
 *         - $ref: '#/components/schemas/ConfigurableItemRequestBody'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 * /api/v1/configurableItem:
 *   post:
 *     summary: Create a new configurable item.
 *     description: Create a new configurable item for a specific application.
 *     tags:
 *       - Configurable Item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfigurableItemRequestBody'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

	private async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const url = zod.string().parse(req.headers.host)
			const data = ConfigurableItemSchema.parse(req.body)
			data.url = url
			const result = await this.configurableItemSvc.create(data)

			res.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}
	/**
 * @swagger
 * /api/v1/configurableItem/{id}:
 *   post:
 *     summary: Update a configurable item.
 *     description: Update a configurable item for a specific application.
 *     tags:
 *       - Configurable Item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the configurable item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfigurableItemRequestBody'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

	private async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = zod.number().parse(+req.params.id)
			const data = UpdateConfigurableItemSchema.parse(req.body)
			const result = await this.configurableItemSvc.update(data, id)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	/**
 * @swagger
 * /api/v1/configurableItem/{id}:
 *   delete:
 *     summary: Delete a configurable item by ID.
 *     description: Delete a configurable item by its ID.
 *     tags:
 *       - Configurable Item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the configurable item to delete
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */
	private async delete(req: Request, res: Response, next: NextFunction): Promise<void>  {
		try {
			const id = zod.number().parse(+req.params.id)
			const result = await this.configurableItemSvc.delete(id)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}


	private setupRoutes(): void {
		this.router.get('/:page', this.getPage.bind(this))
		this.router.get('/', this.getAllByApplication.bind(this))
		this.router.post('/', this.create.bind(this))
		this.router.patch('/:id', this.update.bind(this))
		this.router.delete('/:id', this.delete.bind(this))
	}

	private setupMiddlewares(): void { }

	public getRouter(): Router {
		return this.router
	}
}

export default ConfigurableItemRouter.getInstance
