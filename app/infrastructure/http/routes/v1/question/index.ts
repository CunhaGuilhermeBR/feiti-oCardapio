import { NextFunction, Request, Response, Router } from 'express'
import { InterviewQuestionService } from '@/services/interviewQuestion'
import { NotCreatedError, NotFoundError } from '@/services/errors'
import zod from 'zod'
import { InterviewQuestionCreateSchema, InterviewQuestionRequestBodySchema } from './types'

export class QuestionRouter {
	private interviewQuestionSvc: InterviewQuestionService
	private router: Router

	private static instance: QuestionRouter

	static getInstance(interviewQuestionSvc: InterviewQuestionService) {
		if (!QuestionRouter.instance) {
			QuestionRouter.instance = new QuestionRouter(interviewQuestionSvc)
		}
		return QuestionRouter.instance
	}

	private constructor(interviewQuestionSvc: InterviewQuestionService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.interviewQuestionSvc = interviewQuestionSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
 * @swagger
 * /api/v1/question/{index}/{questionnaireId}:
 *   get:
 *     summary: Get a specific question from a questionnaire
 *     description: Retrieve a specific question using the questionnaireId and the index of the question.
 *     tags:
 *       - InterviewQuestion
 *     parameters:
 *       - in: path
 *         name: questionnaireId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the questionnaire
 *       - in: path
 *         name: index
 *         required: true
 *         schema:
 *           type: integer
 *         description: The index of the question within the questionnaire
 *     responses:
 *       200:
 *         description: Successfully retrieved the question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: integer
 *                   description: The index of the question
 *                 question:
 *                   type: string
 *                   description: The question text
 *                 questionnaireId:
 *                   type: integer
 *                   description: The ID of the questionnaire
 *                 configQuestionId:
 *                   type: integer
 *                   description: The ID of the configuration question
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal Server Error
 */
	private async getQuestion(req: Request, res: Response, next: NextFunction) {
		try {
			const index = zod.number().int().positive().parse(+req.params.index)
			const questionnaireId = zod.number().int().positive().parse(+req.params.questionnaireId)
			const result = await this.interviewQuestionSvc.findOne(index, questionnaireId)
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
  * /api/v1/question/{index}/{questionnaireId}:
  *   patch:
  *     summary: Update a question
  *     description: Update a question in a questionnaire
  *     tags:
  *       - InterviewQuestion
  *     parameters:
  *       - in: path
  *         name: index
  *         required: true
  *         schema:
  *           type: integer
  *         description: Interview Question Index
  *       - in: path
  *         name: questionnaireId
  *         required: true
  *         schema:
  *           type: integer
  *         description: Interview Question questionnaire ID
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InterviewQuestionRequestBody'
  *     responses:
  *       200:
  *         description: Successfully updated the question
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/InterviewQuestionResponse'
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     InterviewQuestionRequestBody:
  *       type: object
  *       properties:
  *         question:
  *           type: string
  *           description: The question text
  *         configQuestionId:
  *           type: integer
  *           description: The ID of the configuration question
  *     InterviewQuestionResponse:
  *       type: object
  *       properties:
  *         index:
  *           type: integer
  *         question:
  *           type: string
  *         questionnaireId:
  *           type: integer
  *         configQuestionId:
  *           type: integer
  *         InterviewQuestionnaire:
  *           type: object
  *         ConfigQuestion:
  *           type: object
  */
	private async updateQuestion(req: Request, res: Response, next: NextFunction) {
		try {
			const index = zod.number().int().positive().parse(+req.params.index)
			const questionnaireId = zod.number().int().positive().parse(+req.params.questionnaireId)
			const data = InterviewQuestionRequestBodySchema.parse(req.body)

			const result = await this.interviewQuestionSvc.update(data, index, questionnaireId)
			if (!result) {
				throw new NotFoundError('Interview Questionnaire', 'index/questionnaireId')
			}

			res.json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/question/{index}/{questionnaireId}:
  *   delete:
  *     summary: Delete a question
  *     description: Delete a question from a questionnaire
  *     tags:
  *       - InterviewQuestion
  *     parameters:
  *       - in: path
  *         name: index
  *         required: true
  *         schema:
  *           type: integer
  *         description: Interview Question Index
  *       - in: path
  *         name: questionnaireId
  *         required: true
  *         schema:
  *           type: integer
  *         description: Interview Question questionnaire ID
  *     responses:
  *       200:
  *         description: Successfully deleted the question
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 success:
  *                   type: boolean
  *                   description: Indicates if the deletion was successful
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Internal Server Error
  */
	private async deleteQuestion(req: Request, res: Response, next: NextFunction) {
		try {
			const index = zod.number().int().positive().parse(+req.params.index)
			const questionnaireId = zod.number().int().positive().parse(+req.params.questionnaireId)
			const result = await this.interviewQuestionSvc.delete(index, questionnaireId)

			res.json(result)
		} catch (error) {
			next(error)
		}
	}
	/**
      * @swagger
      * /api/v1/question:
      *   post:
      *     summary: Create a new interview question
      *     description: Create a new interview question with the provided data
      *     tags:
      *       - InterviewQuestion
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             $ref: '#/components/schemas/InterviewQuestionCreateRequestBody'
      *     responses:
      *       200:
      *         description: Successfully created the interview question
      *         content:
      *           application/json:
      *             schema:
      *               $ref: '#/components/schemas/InterviewQuestionResponse'
      *       400:
      *         description: Bad Request
      *       500:
      *         description: Internal Server Error
      * components:
      *   schemas:
      *     InterviewQuestionCreateRequestBody:
      *       type: object
      *       properties:
      *         question:
      *           type: string
      *           description: The question text
      *         configQuestionId:
      *           type: integer
      *           description: The ID of the configuration question
      *         index:
      *           type: integer
      *           description: The index of the question
      *         questionnaireId:
      *           type: integer
      *           description: The ID of the questionnaire
      *     InterviewQuestionResponse:
      *       type: object
      *       properties:
      *         index:
      *           type: integer
      *         question:
      *           type: string
      *         questionnaireId:
      *           type: integer
      *         configQuestionId:
      *           type: integer
      *         InterviewQuestionnaire:
      *           type: object
      *         ConfigQuestion:
      *           type: object
      */
	private async createQuestion(req: Request, res: Response, next: NextFunction) {
		try {
			const data = InterviewQuestionCreateSchema.parse(req.body)
			const result = await this.interviewQuestionSvc.create(data)
			if (!result) {
				throw new NotCreatedError('Interview Question')
			}

			res.status(201).json(result)
		} catch (error) {
			next(error)
		}
	}

	/**
  * @swagger
  * /api/v1/question/{questionnaireId}:
  *   get:
  *     summary: Get all interview questions by questionnaire ID
  *     description: Retrieve a list of all interview questions associated with a specific questionnaire ID
  *     tags:
  *       - InterviewQuestion
  *     parameters:
  *       - in: path
  *         name: questionnaireId
  *         required: true
  *         schema:
  *           type: integer
  *         description: The ID of the questionnaire
  *     responses:
  *       200:
  *         description: A list of interview questions for the given questionnaire
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/InterviewQuestionResponse'
  *       400:
  *         description: Bad Request
  *       404:
  *         description: Questionnaire not found
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     InterviewQuestionResponse:
  *       type: object
  *       properties:
  *         index:
  *           type: integer
  *         question:
  *           type: string
  *         questionnaireId:
  *           type: integer
  *         configQuestionId:
  *           type: integer
  *         InterviewQuestionnaire:
  *           type: object
  *         ConfigQuestion:
  *           type: object
  */
	private async getAllByQuestionnaire(req: Request, res: Response, next: NextFunction) {
		try {
			const questionnaireId = zod.number().int().positive().parse(+req.params.questionnaireId)
			const result = await this.interviewQuestionSvc.findByQuestionnaire(questionnaireId)

			res.status(200).json(result)
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get('/:index/:questionnaireId', this.getQuestion.bind(this))
		this.router.get('/:questionnaireId', this.getAllByQuestionnaire.bind(this))
		this.router.patch('/:index/:questionnaireId', this.updateQuestion.bind(this))
		this.router.delete('/:index/:questionnaireId', this.deleteQuestion.bind(this))
		this.router.post('/', this.createQuestion.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default QuestionRouter.getInstance
