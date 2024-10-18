import { NextFunction, Request, Response, Router } from 'express'
import { TutorService } from '@/services/tutor'
import { TutorCreateSchema, TutorUpdateSchema } from './types'
import zod from 'zod'

export class TutorRouter {
	private tutorSvc: TutorService
	private router: Router

	private static instance: TutorRouter

	static getInstance(tutorSvc: TutorService) {
		if (!TutorRouter.instance) {
			TutorRouter.instance = new TutorRouter(tutorSvc)
		}
		return TutorRouter.instance
	}

	private constructor(tutorSvc: TutorService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.tutorSvc = tutorSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
  * @swagger
  * /api/v1/tutor:
  *   post:
  *     summary: Create a new tutor
  *     description: Create a new tutor with the provided email and password
  *     tags:
  *       - Tutor
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/TutorCreateRequestBody'
  *     responses:
  *       201:
  *         description: Successfully created the tutor
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/TutorResponse'
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TutorCreateRequestBody:
  *       type: object
  *       properties:
  *         email:
  *           type: string
  *           format: email
  *           description: The email address of the tutor
  *         password:
  *           type: string
  *           description: The password for the tutor's account
  *       required:
  *         - email
  *         - password
  *     TutorResponse:
  *       type: object
  *       properties:
  *         id:
  *           type: string
  *           description: The unique identifier of the tutor
  *         email:
  *           type: string
  *           format: email
  *           description: The email address of the tutor
  *         creationDate:
  *           type: string
  *           format: date-time
  *           description: The date and time when the tutor was created
  *       required:
  *         - id
  *         - email
  *         - creationDate
  */
	private async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = TutorCreateSchema.parse(req.body)
			const tutor = await this.tutorSvc.create(data)
			res.status(201).json(tutor)
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/tutor/{id}:
  *   patch:
  *     summary: Update an existing tutor
  *     description: Update the email and/or password of an existing tutor by ID
  *     tags:
  *       - Tutor
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The unique identifier of the tutor
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/TutorUpdateRequestBody'
  *     responses:
  *       200:
  *         description: Successfully updated the tutor
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Tutor not found
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TutorUpdateSchema:
  *       type: object
  *       properties:
  *         email:
  *           type: string
  *           format: email
  *           description: The email address of the tutor
  *         password:
  *           type: string
  *           description: The password for the tutor's account
  *         firstLogin:
  *           type: boolean
  *           description: If its the first time login from tutor
  */
	private async update(req: Request, res: Response, next: NextFunction){
		const id = zod.string().parse(req.params.id)
		const data = TutorUpdateSchema.parse(req.body)
		await this.tutorSvc.update(data, id)
		res.status(200).send()
	}

	/**
  * @swagger
  * /api/v1/tutor/{id}:
  *   delete:
  *     summary: Delete a tutor
  *     description: Delete a tutor by their unique identifier
  *     tags:
  *       - Tutor
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The unique identifier of the tutor to be deleted
  *     responses:
  *       200:
  *         description: Successfully deleted the tutor
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Tutor not found
  *       500:
  *         description: Internal Server Error
  */
	private async delete(req: Request, res: Response, next: NextFunction){
		const id = zod.string().parse(req.params.id)
		await this.tutorSvc.delete(id)
		res.status(200).send()
	}

	/**
  * @swagger
  * /api/v1/tutors:
  *   get:
  *     summary: Retrieve a list of all tutors
  *     description: Get a list of all tutors in the system
  *     tags:
  *       - Tutor
  *     responses:
  *       200:
  *         description: A list of tutors
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/TutorResponse'
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     TutorResponse:
  *       type: object
  *       properties:
  *         id:
  *           type: string
  *           description: The unique identifier of the tutor
  *         email:
  *           type: string
  *           format: email
  *           description: The email address of the tutor
  *         creationDate:
  *           type: string
  *           format: date-time
  *           description: The date and time when the tutor was created
  *       required:
  *         - id
  *         - email
  *         - createdat
  *         - firstLogin
  */
	private async getAll(req: Request, res: Response, next: NextFunction){
		const data = await this.tutorSvc.findAll()
		return res.status(200).json(data)
	}

	private setupRoutes() {
		this.router.post('/', this.create.bind(this))
		this.router.patch('/:id', this.update.bind(this))
		this.router.delete('/:id', this.delete.bind(this))
		this.router.get('/', this.getAll.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default TutorRouter.getInstance
