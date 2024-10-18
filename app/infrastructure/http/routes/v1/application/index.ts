import { NotCreatedError, NotFoundError } from '@/services/errors'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'
import { ApplicationService } from '@/services/application'
import { ApplicationRequestBody, ApplicationUpdateRequestBody } from './types'


export class ApplicationRouter {
    private appSvc: ApplicationService
    private router: Router

    private static instance: ApplicationRouter

    static getInstance(appSvc: ApplicationService) {
        if (!ApplicationRouter.instance) {
            ApplicationRouter.instance = new ApplicationRouter(appSvc)
        }
        return ApplicationRouter.instance
    }

    private constructor(appSvc: ApplicationService) {
        this.router = Router({
            mergeParams: true,
            caseSensitive: true,
            strict: true,
        })
        this.appSvc = appSvc
        this.setupMiddlewares()
        this.setupRoutes()
    }

    /**
 * @swagger
 * /api/v1/application:
 *   post:
 *     summary: Create a new Application
 *     description: Create a new Application with the provided details.
 *     tags:
 *       - Application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the application
 *                 example: "https://example.com"
 *               name:
 *                 type: string
 *                 description: The name of the application
 *                 example: "My Application"
 *               imageurl:
 *                 type: string
 *                 description: The image URL for the application
 *                 example: "https://example.com/logo.png"
 *               enabled:
 *                 type: boolean
 *                 description: Whether the application is enabled
 *                 example: true
 *     responses:
 *       201:
 *         description: Successfully created the Application
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal Server Error
 */
    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = ApplicationRequestBody.parse(req.body)
            const result = await this.appSvc.create(data)
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
 * /api/v1/application/{id}:
 *   patch:
 *     summary: Update an existing Application
 *     description: Update an existing Application by its ID with partial data.
 *     tags:
 *       - Application
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Application to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the application
 *                 example: "https://example.com"
 *               name:
 *                 type: string
 *                 description: The name of the application
 *                 example: "Updated Application"
 *               imageurl:
 *                 type: string
 *                 description: The image URL for the application
 *                 example: "https://example.com/newlogo.png"
 *               enabled:
 *                 type: boolean
 *                 description: Whether the application is enabled
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully updated the Application
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal Server Error
 */
    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = ApplicationUpdateRequestBody.parse(req.body)
            const id = zod.number().int().positive().parse(+req.params.id)
            const result = await this.appSvc.update(data, id)
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
 * /api/v1/application/{id}:
 *   delete:
 *     summary: Delete an Application by ID
 *     description: Delete an existing Application by its ID.
 *     tags:
 *       - Application
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the Application to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the Application
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal Server Error
 */
    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = zod.number().int().positive().parse(+req.params.id)
            await this.appSvc.delete(id)

            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

    /**
 * @swagger
 * /api/v1/application:
 *   get:
 *     summary: Get all Applications
 *     description: Retrieve a list of all Applications.
 *     tags:
 *       - Application
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of Applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the application
 *                   url:
 *                     type: string
 *                     description: The URL of the application
 *                   name:
 *                     type: string
 *                     description: The name of the application
 *                   imageurl:
 *                     type: string
 *                     description: The image URL of the application
 *                   enabled:
 *                     type: boolean
 *                     description: Whether the application is enabled
 *       500:
 *         description: Internal Server Error
 */
    private async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.appSvc.findAll()
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


export default ApplicationRouter.getInstance
