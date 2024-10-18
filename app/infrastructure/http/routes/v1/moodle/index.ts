import { NextFunction, Request, Response, Router } from 'express'
import MoodleWrapper from '@/infrastructure/datasources/moodle'
import { EnrollSchema } from './types'
import { InterviewService } from '@/services/interview'

export class MoodleRouter {
	private router: Router
	private moodle: MoodleWrapper
	private interviewSvc: InterviewService
	private static instance: MoodleRouter

	static getInstance(moodle: MoodleWrapper, interviewSvc: InterviewService) {
		if (!MoodleRouter.instance) {
			MoodleRouter.instance = new MoodleRouter(moodle, interviewSvc)
		}
		return MoodleRouter.instance
	}

	private constructor(moodle: MoodleWrapper, interviewSvc: InterviewService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.interviewSvc = interviewSvc
		this.moodle = moodle
		this.setupRoutes()
	}

	/**
 * @swagger
 *
 * /api/v1/moodle/enroll:
 *   post:
 *     summary: Enroll a user in courses
 *     description: Endpoint to enroll a user in multiple courses based on the provided interview ID.
 *     tags:
 *       - Moodle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               interviewId:
 *                 type: string
 *                 description: ID of the interview
 *               coursesId:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: Array of course IDs to enroll the user in
 *             required:
 *               - interviewId
 *               - coursesId
 *     responses:
 *       '200':
 *         description: OK. User enrolled in the courses successfully.
 *       '400':
 *         description: Bad Request. Invalid input data.
 *       '500':
 *         description: Internal Server Error. Something went wrong on the server side.
 */
	private async enroll(req: Request, res: Response, next: NextFunction) {
		try {
			const data = EnrollSchema.parse(req.body)
            const interview = await this.interviewSvc.findOne(data.interviewId)
			data.coursesId = this.moodle.addEssentialsCourses(data.coursesId)
            for (const courseId of data.coursesId){
                await this.moodle.addUserToCourse(interview.Sale.externalId, courseId)
            }
            return res.status(200).send()
		} catch (error) {
			next(error)
		}
	}


	private setupRoutes(): void {
		this.router.post('/enroll', this.enroll.bind(this))
	}

	public getRouter(): Router {
		return this.router
	}
}

export default MoodleRouter.getInstance
