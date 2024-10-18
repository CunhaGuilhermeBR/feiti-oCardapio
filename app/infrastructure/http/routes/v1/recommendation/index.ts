import { NotFoundError } from '@/services/errors'
import { RecommendationService } from '@/services/recommendation'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'


export class RecommendationRouter {
	private recommendationSvc: RecommendationService
	private router: Router

	private static instance: RecommendationRouter

	static getInstance(recommendationSvc: RecommendationService) {
		if (!RecommendationRouter.instance) {
			RecommendationRouter.instance = new RecommendationRouter(recommendationSvc)
		}
		return RecommendationRouter.instance
	}

	private constructor(recommendationSvc: RecommendationService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.recommendationSvc = recommendationSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
     * @swagger
     * /api/v1/recommendation/{interviewId}:
     *   get:
     *     summary: Get all recommendation for a Interview Id
     *     description: Retrieve all recommendation for an interview.
     *     tags:
     *       - Recommendation
     *     parameters:
     *       - in: path
     *         name: interviewId
     *         required: true
     *         schema:
     *           type: uuid
     *         description: The ID of the interview
     *     responses:
     *       200:
     *         description: Successfully retrieved the recommendations
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   courseName:
     *                     type: string
     *                     description: The name of the course
     *                   interviewId:
     *                     type: string
     *                     description: The interview id
     *       404:
     *         description: Recommendations not found
     *       500:
     *         description: Internal Server Error
    */
	private async getRecommendation(req: Request, res: Response, next: NextFunction) {
		try {
			const interviewId = zod.string().uuid().parse(req.params.interviewId)

			const result = await this.recommendationSvc.findManyByInterviewId(interviewId)

			if (!result) {
				throw new NotFoundError('Interview Recommendationnaire', 'Id')
			}

			res.json(result)
		} catch (error) {
			next(error)
		}
	}
    
	private setupRoutes() {
		this.router.get('/:interviewId', this.getRecommendation.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default RecommendationRouter.getInstance
