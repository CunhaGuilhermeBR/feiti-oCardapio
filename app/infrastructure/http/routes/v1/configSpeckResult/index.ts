import { NotCreatedError, NotFoundError } from '@/services/errors'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'
import { ConfigSpeckResultService } from '@/services/configSpeckResult'
import { ConfigSpeckResultRequestBody, ConfigSpeckResultUpdateRequestBody } from './types'


export class ConfigSpeckResultRouter {
	private configSpeckResultSvc: ConfigSpeckResultService
	private router: Router

	private static instance: ConfigSpeckResultRouter

	static getInstance(configSpeckResultSvc: ConfigSpeckResultService) {
		if (!ConfigSpeckResultRouter.instance) {
			ConfigSpeckResultRouter.instance = new ConfigSpeckResultRouter(configSpeckResultSvc)
		}
		return ConfigSpeckResultRouter.instance
	}

	private constructor(configSpeckResultSvc: ConfigSpeckResultService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.configSpeckResultSvc = configSpeckResultSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
  * @swagger
  * /api/v1/configSpeckResult:
  *   post:
  *     summary: Create a new Config Speck Result
  *     description: Create a Config Speck Result with the specified data.
  *     tags:
  *       - ConfigSpeckResult
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               speckOrigin:
  *                 type: string
  *                 description: The origin of the speck
  *               speckApiToken:
  *                 type: string
  *                 description: The API token for speck
  *               speckUrl:
  *                 type: string
  *                 description: The URL for speck
  *               itemId:
  *                 type: integer
  *                 description: The ID of the item
  *               appId:
  *                 type: integer
  *                 description: The application ID (optional)
  *     responses:
  *       201:
  *         description: Config Speck Result created successfully
  *       400:
  *         description: Invalid input
  *       500:
  *         description: Internal Server Error
  */
	private async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = ConfigSpeckResultRequestBody.parse(req.body)
			const result = await this.configSpeckResultSvc.create(data)
			if (!result) {
				throw new NotCreatedError('Config Speck result')
			}
			res.status(201).send()
		} catch (error) {
			next(error)
		}
	}

	/**
     * @swagger
     * /api/v1/configSpeckResult/{id}:
     *   patch:
     *     summary: Update an existing Config Speck Result
     *     description: Update a Config Speck Result by its ID.
     *     tags:
     *       - ConfigSpeckResult
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: The ID of the Config Speck Result to update
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               speckOrigin:
     *                 type: string
     *                 description: The origin of the speck
     *               speckApiToken:
     *                 type: string
     *                 description: The API token for speck
     *               speckUrl:
     *                 type: string
     *                 description: The URL for speck
     *               itemId:
     *                 type: integer
     *                 description: The ID of the item
     *               appId:
     *                 type: integer
     *                 description: The application ID (optional)
     *     responses:
     *       200:
     *         description: Successfully updated the Config Speck Result
     *       400:
     *         description: Invalid input
     *       404:
     *         description: Config Speck Result not found
     *       500:
     *         description: Internal Server Error
     */
	private async update(req: Request, res: Response, next: NextFunction) {
		try {
			const data = ConfigSpeckResultUpdateRequestBody.parse(req.body)
			const id = zod.number().int().positive().parse(+req.params.id)
			const result = await this.configSpeckResultSvc.update(data, id)
			if (!result) {
				throw new NotFoundError('Config speck result', 'id')
			}
			res.status(200).send()
		} catch (error) {
			next(error)
		}
	}

	/**
   * @swagger
   * /api/v1/configSpeckResult/{id}:
   *   delete:
   *     summary: Delete a Config Speck Result
   *     description: Delete a Config Speck Result by its ID.
   *     tags:
   *       - ConfigSpeckResult
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the Config Speck Result to delete
   *     responses:
   *       200:
   *         description: Successfully deleted the Config Speck Result
   *       400:
   *         description: Invalid input
   *       404:
   *         description: Config Speck Result not found
   *       500:
   *         description: Internal Server Error
   */
	private async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().int().positive().parse(+req.params.id)
			await this.configSpeckResultSvc.delete(id)

			res.status(200).send()
		} catch (error) {
			next(error)
		}
	}

	/**
    * @swagger
    * /api/v1/configSpeckResult/{appId?}:
    *   get:
    *     summary: Get all Config Speck Results
    *     description: Retrieve all Config Speck Results, optionally filtered by application ID.
    *     tags:
    *       - ConfigSpeckResult
    *     parameters:
    *       - in: path
    *         name: appId
    *         required: false
    *         schema:
    *           type: integer
    *         description: Optional application ID to filter the Config Speck Results
    *     responses:
    *       200:
    *         description: Successfully retrieved the Config Speck Results
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 type: object
    *                 properties:
    *                   id:
    *                     type: integer
    *                     description: The ID of the Config Speck Result
    *                   speckOrigin:
    *                     type: string
    *                     description: The origin of the speck
    *                   speckApiToken:
    *                     type: string
    *                     description: The API token for speck
    *                   speckUrl:
    *                     type: string
    *                     description: The URL for speck
    *                   itemId:
    *                     type: integer
    *                     description: The ID of the associated Configurable Item
    *                   appId:
    *                     type: integer
    *                     description: The ID of the application (optional)
    *       400:
    *         description: Invalid input
    *       500:
    *         description: Internal Server Error
    */
	private async findAll(req: Request, res: Response, next: NextFunction) {
		try {
			const appId = req.query.appId ? zod.number().int().positive().parse(+req.query.appId) : undefined
			const result = await this.configSpeckResultSvc.findAll(appId)
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.post('/', this.create.bind(this)),
		this.router.patch('/:id', this.update.bind(this)),
		this.router.delete('/:id', this.delete.bind(this)),
		this.router.get('/', this.findAll.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default ConfigSpeckResultRouter.getInstance
