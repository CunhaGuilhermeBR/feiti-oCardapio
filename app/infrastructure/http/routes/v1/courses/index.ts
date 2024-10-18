import { CourseService } from '@/services/course'
import { RecommendationService } from '@/services/recommendation'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'


export class CourseRouter {
	private courseSvc: CourseService
	private recommendationSvc: RecommendationService
	private router: Router

	private static instance: CourseRouter

	static getInstance(courseSvc: CourseService, recommendationSvc: RecommendationService) {
		if (!CourseRouter.instance) {
			CourseRouter.instance = new CourseRouter(courseSvc, recommendationSvc)
		}
		return CourseRouter.instance
	}

	private constructor(courseSvc: CourseService, recommendationSvc: RecommendationService) {
		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.recommendationSvc = recommendationSvc
		this.courseSvc = courseSvc
		this.setupMiddlewares()
		this.setupRoutes()
	}

	/**
	 * @swagger
	 * /api/v1/course/all:
	 *   get:
	 *     summary: Get all courses
	 *     description: Retrieve all course available.
	 *     tags:
	 *       - Course
	 *     responses:
	 *       200:
	 *         description: Successfully retrieved the courses
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
	 *         description: Courses not found
	 *       500:
	 *         description: Internal Server Error
	*/
	private async findAllCourses(req: Request, res: Response, next: NextFunction) {
		try {
			res.json(await this.courseSvc.findAll())
		} catch (error) {
			next(error)
		}
	}

	/**
 * @swagger
 * /api/v1/course/recommendationsCourses/:interviewId:
 *   get:
 *     summary: Get all courses with recommendations prioritized
 *     description: Retrieve all available courses with recommendations prioritized at the top of the list based on the provided interview ID.
 *     tags:
 *       - Course
 *     parameters:
 *       - in: path
 *         name: interviewId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the interview to get course recommendations
 *     responses:
 *       200:
 *         description: Successfully retrieved the courses with recommendations prioritized
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the course
 *                   shortName:
 *                     type: string
 *                     description: A short name or abbreviation of the course
 *                   goodFeature:
 *                     type: boolean
 *                     description: Indicates whether the course has a good feature
 *                   createdat:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the course was created
 *                   updatedat:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the course was last updated
 *                   imageUrl:
 *                     type: string
 *                     format: uri
 *                     description: The URL of the course image (can be null)
 *                   description:
 *                     type: string
 *                     description: A description of the course (can be null)
 *                   categoryName:
 *                     type: string
 *                     description: The category name of the course (can be null)
 *                   moodleId:
 *                     type: integer
 *                     format: int32
 *                     description: The Moodle ID of the course
 *                   bigFive:
 *                     type: string
 *                     description: Big Five personality traits related to the course
 *       404:
 *         description: No courses found
 *       500:
 *         description: Internal Server Error
 */
	private async findAllCoursesRecommendations(req: Request, res: Response, next: NextFunction) {
		const interviewId = zod.string().uuid().parse(req.params.interviewId)

		const result = await this.courseSvc.findAll()

		const recommendations = await this.recommendationSvc.findManyByInterviewId(interviewId)
		const recommendedCourseNames = new Set(recommendations.map(r => r.courseName))

		result.sort((a, b) => {
			const aIsRecommended = recommendedCourseNames.has(a.name)
			const bIsRecommended = recommendedCourseNames.has(b.name)

			if (aIsRecommended && !bIsRecommended) {
				return -1
			}
			if (!aIsRecommended && bIsRecommended) {
				return 1
			}
			return 0
		})

		return res.status(200).json(result)

	}

	private setupRoutes() {
		this.router.get('/all', this.findAllCourses.bind(this))
		this.router.get('/recommendationsCourses/:interviewId', this.findAllCoursesRecommendations.bind(this))
	}

	private setupMiddlewares() { }

	public getRouter() {
		return this.router
	}
}


export default CourseRouter.getInstance
