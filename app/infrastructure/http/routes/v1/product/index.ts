import { NotCreatedError, NotFoundError } from '@/services/errors'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'
import { ProductService } from '@/services/product'
import { ProductRequestBody, ProductUpdateRequestBody } from './types'


export class ProductRouter {
	private productSvc: ProductService
	private router: Router

	private static instance: ProductRouter

	static getInstance(productSvc: ProductService) {
		if (!ProductRouter.instance) {
			ProductRouter.instance = new ProductRouter(productSvc)
		}
		return ProductRouter.instance
	}

	private constructor(productSvc: ProductService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.productSvc = productSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
 * @swagger
 * /api/v1/product:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided details.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: An optional description for the product.
 *               price:
 *                 type: string
 *                 description: The price of the product.
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An optional array of options for the product.
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category this product belongs to.
 *               active:
 *                 type: boolean
 *                 description: Indicates if the product is active (default is true).
 *     responses:
 *       '201':
 *         description: Created. The product was successfully created.
 *       '400':
 *         description: Bad Request. The request body is invalid.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = ProductRequestBody.parse(req.body)
			const result = await this.productSvc.create(data)
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
 * /api/v1/product/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Update an existing product with the provided ID and new data.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to be updated.
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
 *                 description: The new name of the product (optional).
 *               description:
 *                 type: string
 *                 description: An optional new description for the product.
 *               price:
 *                 type: string
 *                 description: The new price of the product (optional).
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An optional array of new options for the product.
 *               categoryId:
 *                 type: string
 *                 description: The new ID of the category this product belongs to (optional).
 *               active:
 *                 type: boolean
 *                 description: Indicates if the product is active (optional).
 *     responses:
 *       '200':
 *         description: OK. The product was successfully updated.
 *       '400':
 *         description: Bad Request. The request body is invalid.
 *       '404':
 *         description: Not Found. The product with the specified ID does not exist.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async update(req: Request, res: Response, next: NextFunction) {
		try {
			const data = ProductUpdateRequestBody.parse(req.body)
			const id = zod.string().parse(req.params.id)
			const result = await this.productSvc.update(data, id)
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
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete an existing product
 *     description: Delete a product by its ID.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: OK. The product was successfully deleted.
 *       '404':
 *         description: Not Found. The product with the specified ID does not exist.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.string().parse(req.params.id)
			await this.productSvc.delete(id)

			res.status(200).send()
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Retrieve all products
 *     description: Get a list of all products.
 *     tags:
 *       - Product
 *     responses:
 *       '200':
 *         description: OK. A list of all products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier for the product.
 *                   name:
 *                     type: string
 *                     description: The name of the product.
 *                   description:
 *                     type: string
 *                     description: An optional description of the product.
 *                   price:
 *                     type: string
 *                     description: The price of the product.
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: An optional array of options for the product.
 *                   categoryId:
 *                     type: string
 *                     description: The ID of the category this product belongs to.
 *                   active:
 *                     type: boolean
 *                     description: Indicates if the product is active.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async findAll(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.productSvc.findAll()
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


export default ProductRouter.getInstance
