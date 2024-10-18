import { NextFunction, Request, Response, Router } from 'express'
import { FeedbackService } from '@/services/feedback'
import { NotCreatedError, NotFoundError } from '@/services/errors'
import zod from 'zod'
import { FeedbackSchema, UpdateFeedbackSchema } from './types'

export class FeedbackRouter {
	private feedbackSvc: FeedbackService
	private router: Router

	private static instance: FeedbackRouter

	static getInstance(feedbackSvc: FeedbackService) {
		if (!FeedbackRouter.instance) {
			FeedbackRouter.instance = new FeedbackRouter(feedbackSvc)
		}
		return FeedbackRouter.instance
	}

	private constructor(feedbackSvc: FeedbackService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.feedbackSvc = feedbackSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
    * @swagger
    /api/v1/feedback/{saleId}/{title}:
     *   get:
     *     summary: Get feedback for a specific sale and title
     *     description: Retrieve feedback for a specific sale ID and title. If the feedback is not found, a 404 error is returned.
     *     tags:
     *       - Feedback
     *     parameters:
     *       - in: path
     *         name: saleId
     *         required: true
     *         schema:
     *           type: string
     *         description: The ID of the sale
     *       - in: path
     *         name: title
     *         required: true
     *         schema:
     *           type: string
     *         description: The title associated with the feedback
     *     responses:
     *       200:
     *         description: Successfully retrieved the feedback
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 saleId:
     *                   type: string
     *                   description: The ID of the sale
     *                 title:
     *                   type: string
     *                   description: The title associated with the feedback
     *                 feedback:
     *                   type: string
     *                   description: The feedback text
     *       404:
     *         description: Feedback not found for the provided saleId and title
     *       500:
     *         description: Internal Server Error
    */
	private async getFeedback(req: Request, res: Response, next: NextFunction) {
		try {
			const saleId = zod.string().parse(req.params.saleId)
			const title = zod.string().parse(req.params.title)
			const result = await this.feedbackSvc.findOne(title, saleId)
			if (!result) {
				throw new NotFoundError('Feedback', 'saleId_title')
			}

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
* @swagger
* /api/v1/feedback/{saleId}/{title}:
*   put:
*     summary: Update a feedback entry
*     description: Update an existing feedback entry with the provided data
*     tags:
*       - Feedback
*     parameters:
*       - name: saleId
*         in: path
*         required: true
*         description: The ID of the sale associated with the feedback
*         schema:
*           type: string
*       - name: title
*         in: path
*         required: true
*         description: The title of the feedback to update
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/FeedbackCreateRequestBody'
*     responses:
*       200:
*         description: Successfully updated the feedback entry
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/FeedbackResponse'
*       400:
*         description: Bad Request
*       404:
*         description: Feedback entry not found
*       500:
*         description: Internal Server Error
* components:
*   schemas:
*     FeedbackCreateRequestBody:
*       type: object
*       properties:
*         saleId:
*           type: string
*           description: The ID of the sale
*         title:
*           type: string
*           description: The title of the feedback
*         content:
*           type: string
*           description: The content of the feedback
*         status:
*           type: string
*           enum:
*             - PENDING
*             - APPROVED
*             - REJECTED
*           default: PENDING
*           description: The status of the feedback
*     FeedbackResponse:
*       type: object
*       properties:
*         saleId:
*           type: string
*           description: The ID of the sale
*         title:
*           type: string
*           description: The title of the feedback
*         content:
*           type: string
*           description: The content of the feedback
*         status:
*           type: string
*           enum:
*             - PENDING
*             - APPROVED
*           description: The status of the feedback
*/
	private async update(req: Request, res: Response, next: NextFunction) {
		try {
			const saleId = zod.string().parse(req.params.saleId)
			const title = zod.string().parse(req.params.title)
			const data = UpdateFeedbackSchema.parse(req.body)

			const result = await this.feedbackSvc.update(data, title, saleId)
			if (!result) {
				throw new NotFoundError('Feedback', 'saleId_title')
			}

			res.json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
* @swagger
* /api/v1/feedback/pending:
*   get:
*     summary: Retrieve all pending feedback entries
*     description: Fetch all feedback entries with the status "PENDING"
*     tags:
*       - Feedback
*     responses:
*       200:
*         description: Successfully retrieved all pending feedback entries
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/FeedbackResponse'
*       500:
*         description: Internal Server Error
* components:
*   schemas:
*     FeedbackResponse:
*       type: object
*       properties:
*         saleId:
*           type: string
*           description: The ID of the sale
*         title:
*           type: string
*           description: The title of the feedback
*         content:
*           type: string
*           description: The content of the feedback
*         status:
*           type: string
*           enum:
*             - PENDING
*             - APPROVED
*           description: The status of the feedback
*/
	private async getPending(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await this.feedbackSvc.findAllPending()

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
* @swagger
* /api/v1/feedback:
*   post:
*     summary: Create a new feedback entry
*     description: Create a new feedback entry with the provided data
*     tags:
*       - Feedback
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/FeedbackCreateRequestBody'
*     responses:
*       201:
*         description: Successfully created the feedback entry
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/FeedbackResponse'
*       400:
*         description: Bad Request
*       500:
*         description: Internal Server Error
* components:
*   schemas:
*     FeedbackCreateRequestBody:
*       type: object
*       properties:
*         saleId:
*           type: string
*           description: The ID of the sale
*         title:
*           type: string
*           description: The title of the feedback
*         content:
*           type: string
*           description: The content of the feedback
*         status:
*           type: string
*           enum:
*             - PENDING
*             - APPROVED
*           default: PENDING
*           description: The status of the feedback
*     FeedbackResponse:
*       type: object
*       properties:
*         saleId:
*           type: string
*           description: The ID of the sale
*         title:
*           type: string
*           description: The title of the feedback
*         content:
*           type: string
*           description: The content of the feedback
*         status:
*           type: string
*           enum:
*             - PENDING
*             - APPROVED
*           description: The status of the feedback
*/
	private async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = FeedbackSchema.parse(req.body)
			const result = await this.feedbackSvc.create(data)
			if (!result) {
				throw new NotCreatedError('Feedback')
			}

			res.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/:saleId/:title', this.getFeedback.bind(this))
		this.router.patch('/:saleId/:title', this.update.bind(this))
		this.router.get('/pending', this.getPending.bind(this))
		this.router.post('/', this.create.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default FeedbackRouter.getInstance
