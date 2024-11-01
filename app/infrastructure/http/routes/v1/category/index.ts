import { NotCreatedError, NotFoundError } from '@/services/errors'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'
import { CategoryRequestBody, CategoryUpdateRequestBody } from './types'
import { CategoryService } from '@/services/category'


export class CategoryRouter {
	private categorySvc: CategoryService
	private router: Router

	private static instance: CategoryRouter

	static getInstance(categorySvc: CategoryService) {
		if (!CategoryRouter.instance) {
			CategoryRouter.instance = new CategoryRouter(categorySvc)
		}
		return CategoryRouter.instance
	}

	private constructor(categorySvc: CategoryService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.categorySvc = categorySvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     description: Create a new category with the provided name and optional description.
 *     tags:
 *       - Category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the category.
 *               description:
 *                 type: string
 *                 description: An optional description for the category.
 *     responses:
 *       '201':
 *         description: Created. The category was successfully created.
 *       '400':
 *         description: Bad Request. The request body is invalid.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = CategoryRequestBody.parse(req.body)
			const result = await this.categorySvc.create(data)
			if (!result) {
				throw new NotCreatedError('Application')
			}
			res.status(201).send()
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/category/{id}:
 *   patch:
 *     summary: Update an existing category
 *     description: Update an existing category with the provided ID and new data.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the category (optional).
 *               description:
 *                 type: string
 *                 description: An optional new description for the category.
 *     responses:
 *       '200':
 *         description: OK. The category was successfully updated.
 *       '400':
 *         description: Bad Request. The request body is invalid.
 *       '404':
 *         description: Not Found. The category with the specified ID does not exist.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async update(req: Request, res: Response, next: NextFunction) {
		try {
			const data = CategoryUpdateRequestBody.parse(req.body)
			const id = zod.string().parse(req.params.id)
			const result = await this.categorySvc.update(data, id)
			if (!result) {
				throw new NotFoundError('Application', 'id')
			}
			res.status(200).send()
		} catch (error) {
			next(error)
		}
	}
	
	/**
 * @swagger
 * /api/v1/category/{id}:
 *   delete:
 *     summary: Delete an existing category
 *     description: Delete a category by its ID.
 *     tags:
 *       - Category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. The category was successfully deleted.
 *       '404':
 *         description: Not Found. The category with the specified ID does not exist.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.string().parse(req.params.id)
			await this.categorySvc.delete(id)

			res.status(200).send()
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/category/group/products:
 *   get:
 *     summary: Retrieve all items grouped by category
 *     description: Get a list of all items organized by their respective categories.
 *     tags:
 *       - Category
 *     responses:
 *       '200':
 *         description: OK. A list of items grouped by category.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier for the item.
 *                     name:
 *                       type: string
 *                       description: The name of the item.
 *                     description:
 *                       type: string
 *                       description: A description of the item.
 *                     price:
 *                       type: string
 *                       description: The price of the item.
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Any options available for the item.
 *                     active:
 *                       type: boolean
 *                       description: Indicates if the item is active.
 *                     categoryId:
 *                       type: string
 *                       description: The ID of the category this item belongs to.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async getByCategorie(req: Request, res: Response, next: NextFunction){
		try {
			const result = await this.categorySvc.getAllByCategorie()
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     summary: Retrieve all categories
 *     description: Get a list of all categories.
 *     tags:
 *       - Category
 *     responses:
 *       '200':
 *         description: OK. A list of all categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the category.
 *                   name:
 *                     type: string
 *                     description: The name of the category.
 *                   description:
 *                     type: string
 *                     description: An optional description of the category.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async findAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.categorySvc.findAll()
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.post('/', this.create.bind(this)),
		this.router.patch('/:id', this.update.bind(this)),
		this.router.delete('/:id', this.delete.bind(this)),
		this.router.get('/', this.findAll.bind(this)),
		this.router.get('/group/products', this.getByCategorie.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default CategoryRouter.getInstance
