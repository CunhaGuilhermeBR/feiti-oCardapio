import { NextFunction, Request, Response, Router } from 'express'
import { NotCreatedError, NotFoundError } from '@/services/errors'
import zod from 'zod'
import { EmailService } from '@/services/email'
import { EmailRequestBodySchema, EmailUpdateRequestBodySchema } from './types'

export class EmailRouter {
	private emailSvc: EmailService
	private router: Router

	private static instance: EmailRouter

	static getInstance(emailSvc: EmailService) {
		if (!EmailRouter.instance) {
			EmailRouter.instance = new EmailRouter(emailSvc)
		}
		return EmailRouter.instance
	}

	private constructor(emailSvc: EmailService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.emailSvc = emailSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
  * @swagger
  * /api/v1/applicationEmail/{applicationId}:
  *   get:
  *     summary: Retrieve all emails for a specific application
  *     description: Get a list of all emails configured for a specific application by its ID
  *     tags:
  *       - Application Email
  *     parameters:
  *       - in: path
  *         name: applicationId
  *         required: true
  *         schema:
  *           type: integer
  *           description: The unique identifier of the application
  *     responses:
  *       200:
  *         description: A list of emails for the specified application
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/EmailRequestBody'
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Application not found
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     EmailRequestBody:
  *       type: object
  *       properties:
  *         email:
  *           type: string
  *           description: The email address
  *         emailPassword:
  *           type: string
  *           description: The password for the email
  *         host:
  *           type: string
  *           description: The email server host
  *         domain:
  *           type: string
  *           description: The email domain
  *         port:
  *           type: integer
  *           description: The port for the email server
  *         applicationId:
  *           type: integer
  *           description: The unique identifier of the application
  *       required:
  *         - email
  *         - emailPassword
  *         - host
  *         - domain
  *         - port
  *         - applicationId
  */
	private async getAllByApplication(req: Request, res: Response, next: NextFunction) {
		try {
			const applicationId = zod.number().int().positive().parse(+req.params.applicationId)
			const result = await this.emailSvc.findByApplication(applicationId)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}


	/**
  * @swagger
  * /api/v1/applicationEmail/{id}:
  *   patch:
  *     summary: Update an email configuration
  *     description: Update the email configuration for a specific ID
  *     tags:
  *       - Application Email
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: The unique identifier of the email configuration to be updated
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/EmailUpdateRequestBody'
  *     responses:
  *       200:
  *         description: Successfully updated the email configuration
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/EmailRequestBody'
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Email configuration not found
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     EmailUpdateRequestBody:
  *       type: object
  *       properties:
  *         email:
  *           type: string
  *           description: The email address
  *         emailPassword:
  *           type: string
  *           description: The password for the email
  *         host:
  *           type: string
  *           description: The email server host
  *         domain:
  *           type: string
  *           description: The email domain
  *         port:
  *           type: integer
  *           description: The port for the email server
  *         applicationId:
  *           type: integer
  *           description: The unique identifier of the application
  *       required:
  *         - email
  *         - emailPassword
  *         - host
  *         - domain
  *         - port
  *         - applicationId
  */
	private async update(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().int().positive().parse(+req.params.id)
			const data = EmailUpdateRequestBodySchema.parse(req.body)
			const result = await this.emailSvc.update(data, id)
			
			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/applicationEmail/{id}:
  *   delete:
  *     summary: Delete an email configuration
  *     description: Delete the email configuration for a specific ID
  *     tags:
  *       - Application Email
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: The unique identifier of the email configuration to be deleted
  *     responses:
  *       200:
  *         description: Successfully deleted the email configuration
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Email configuration not found
  *       500:
  *         description: Internal Server Error
  */
	private async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().int().positive().parse(+req.params.id)
			const result = await this.emailSvc.delete(id)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}
	
	/**
  * @swagger
  * /api/v1/applicationEmail:
  *   post:
  *     summary: Create a new email configuration
  *     description: Create a new email configuration for an application
  *     tags:
  *       - Application Email
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/EmailRequestBody'
  *     responses:
  *       201:
  *         description: Successfully created the email configuration
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/EmailRequestBody'
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     EmailRequestBody:
  *       type: object
  *       properties:
  *         email:
  *           type: string
  *           description: The email address
  *         emailPassword:
  *           type: string
  *           description: The password for the email
  *         host:
  *           type: string
  *           description: The email server host
  *         domain:
  *           type: string
  *           description: The email domain
  *         port:
  *           type: integer
  *           description: The port for the email server
  *         applicationId:
  *           type: integer
  *           description: The unique identifier of the application
  *       required:
  *         - email
  *         - emailPassword
  *         - host
  *         - domain
  *         - port
  *         - applicationId
  */
	private async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = EmailRequestBodySchema.parse(req.body)
			const result = await this.emailSvc.create(data)
			if (!result) {
				throw new NotCreatedError('Application Email')
			}

			res.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/:applicationId', this.getAllByApplication.bind(this))
		this.router.patch('/:id', this.update.bind(this))
		this.router.delete('/:id', this.delete.bind(this))
		this.router.post('/', this.create.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default EmailRouter.getInstance
