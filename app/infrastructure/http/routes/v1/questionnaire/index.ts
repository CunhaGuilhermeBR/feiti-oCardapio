import { NextFunction, Request, Response, Router } from 'express'
import { InterviewQuestionnaireService } from '@/services/interviewQuestionnaire'
import { NotFoundError, NotCreatedError } from '@/services/errors'
import { InterviewQuestionnaireRequestBodySchema, InterviewQuestionnaireUpdateRequestBodySchema } from './types'
import zod from 'zod'

export class QuestionnaireRouter {
	private interviewQuestionnaireSvc: InterviewQuestionnaireService
	private router: Router

	private static instance: QuestionnaireRouter

	static getInstance(interviewQuestionnaireSvc: InterviewQuestionnaireService) {
		if (!QuestionnaireRouter.instance) {
			QuestionnaireRouter.instance = new QuestionnaireRouter(interviewQuestionnaireSvc)
		}
		return QuestionnaireRouter.instance
	}

	private constructor(interviewQuestionnaireSvc: InterviewQuestionnaireService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.interviewQuestionnaireSvc = interviewQuestionnaireSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
   * @swagger
   * /api/v1/questionnaire/{questionnaireId}:
   *   get:
   *     summary: Get a questionnaire
   *     description: Get a questionnaire and their respectives questions
   *     tags:
   *       - InterviewQuestionnaire
   *     parameters:
   *       - in: path
   *         name: questionnaireId
   *         required: true
   *         schema:
   *           type: string
   *         description: Interview Questionnaire ID
   *     responses:
   *       200:
   *         description: Success
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Internal Server Error
   */
	private async getQuestionnaire(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().int().positive().parse(+req.params.questionnaireId)
			const result = await this.interviewQuestionnaireSvc.findOne(id)
			if (!result) {
				throw new NotFoundError('Interview Questionnaire', 'Id')
			}

			res.json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/questionnaire/{id}:
 *   patch:
 *     summary: Update a questionnaire
 *     description: Update a questionnaire's details
 *     tags:
 *       - InterviewQuestionnaire
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Interview Questionnaire ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InterviewQuestionnaireRequestBodySchema'
 *     responses:
 *       200:
 *         description: Successfully updated the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InterviewQuestionnaireResponse'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 * components:
 *   schemas:
 *     InterviewQuestionnaireRequestBodySchema:
 *       type: object
 *       properties:
 *        configQuestionnaireId:
 *           type: integer
 *           description: ID of the configuration
 *     InterviewQuestionnaireResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         configQuestionnaireId:
 *           type: integer
 *     
 */
	private async updateQuestionnaire(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().int().positive().parse(+req.params.questionnaireId)
			const data = InterviewQuestionnaireUpdateRequestBodySchema.parse(req.body)

			const result = await this.interviewQuestionnaireSvc.update(data, id)
			if (!result) {
				throw new NotFoundError('Interview Questionnaire', 'id')
			}

			res.json(result)
		} catch (error) {
			next(error)
		}
	}
	/**
    * @swagger
    * /api/v1/questionnaire:
    *   post:
    *     summary: Create a new questionnaire
    *     description: Create a new questionnaire with the provided data
    *     tags:
    *       - InterviewQuestionnaire
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/components/schemas/InterviewQuestionnaireRequestBody'
    *     responses:
    *       200:
    *         description: Successfully created the questionnaire
    *         content:
    *           application/json:
    *             schema:
    *               $ref: '#/components/schemas/InterviewQuestionnaireResponse'
    *       400:
    *         description: Bad Request
    *       500:
    *         description: Internal Server Error
    * components:
    *   schemas:
    *     InterviewQuestionnaireRequestBody:
    *       type: object
    *       properties:
    *         configQuestionnaireId:
    *           type: integer
    *           description: The ID of the configuration questionnaire
    *     InterviewQuestionnaireResponse:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *         configQuestionnaireId:
    *           type: integer
    *         templates:
    *           type: array
    *           items:
    *             type: object
    *             properties:
    *               templateProperty1:
    *                 type: string
    *                 description: Example property of a template
    *         InterviewQuestions:
    *           type: array
    *           items:
    *             type: object
    *             properties:
    *               question:
    *                 type: string
    *               configQuestionId:
    *                 type: integer
    *               index:
    *                 type: integer
    *               questionnaireId:
    *                 type: integer
    */
	private async createQuestionnaire(req: Request, res: Response, next: NextFunction) {
		try {
			const data = InterviewQuestionnaireRequestBodySchema.parse(req.body)

			const result = await this.interviewQuestionnaireSvc.create(data)
			if (!result) {
				throw new NotCreatedError('Interview Questionnaire')
			}

			res.json(result)
		} catch (error) {
			next(error)
		}
	}
	/**
    * @swagger
    * /api/v1/questionnaire:
    *   get:
    *     summary: Get all questionnaires
    *     description: Retrieve a list of all questionnaires
    *     tags:
    *       - InterviewQuestionnaire
    *     responses:
    *       200:
    *         description: A list of questionnaires
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/InterviewQuestionnaireResponse'
    *       500:
    *         description: Internal Server Error
    * components:
    *   schemas:
    *     InterviewQuestionnaireResponse:
    *       type: object
    *       properties:
    *         id:
    *           type: integer
    *         configQuestionnaireId:
    *           type: integer
    *         templates:
    *           type: array
    *           items:
    *             type: object
    *             properties:
    *               templateProperty1:
    *                 type: string
    *                 description: Example property of a template
    *         InterviewQuestions:
    *           type: array
    *           items:
    *             type: object
    *             properties:
    *               question:
    *                 type: string
    *               configQuestionId:
    *                 type: integer
    *               index:
    *                 type: integer
    *               questionnaireId:
    *                 type: integer
    */
	private async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const url = zod.string().parse(req.headers.host)
			const result = await this.interviewQuestionnaireSvc.findAllByApplicationUrl(url)

			res.json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
    * @swagger
    * /api/v1/questionnaire/{questionnaireId}:
    *   delete:
    *     summary: Delete a questionnaire
    *     description: Delete a questionnaire by its ID
    *     tags:
    *       - InterviewQuestionnaire
    *     parameters:
    *       - in: path
    *         name: questionnaireId
    *         required: true
    *         schema:
    *           type: integer
    *         description: The ID of the questionnaire to delete
    *     responses:
    *       200:
    *         description: Successfully deleted the questionnaire
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 success:
    *                   type: boolean
    *                   description: Indicates if the deletion was successful
    *                 message:
    *                   type: string
    *                   description: A message about the deletion
    *       400:
    *         description: Bad Request
    *       404:
    *         description: Not Found
    *       500:
    *         description: Internal Server Error
    */
	private async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = zod.number().int().positive().parse(+req.params.questionnaireId)
			const result = await this.interviewQuestionnaireSvc.delete(id)

			res.json({
				success: true,
				message: `Questionnaire with ID ${id} was deleted.`,
				result
			})
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/:questionnaireId', this.getQuestionnaire.bind(this))
		this.router.patch('/:questionnaireId', this.updateQuestionnaire.bind(this))
		this.router.post('/', this.createQuestionnaire.bind(this))
		this.router.get('/', this.getAll.bind(this))
		this.router.delete('/:questionnaireId', this.delete.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default QuestionnaireRouter.getInstance
