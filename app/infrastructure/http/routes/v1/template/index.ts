import { NotCreatedError, NotFoundError } from '@/services/errors'
import { TemplateService } from '@/services/template'
import { NextFunction, Request, Response, Router } from 'express'
import zod from 'zod'
import { TemplateRequestBody, TemplateUpdateRequestBody } from './types'


export class TemplateRouter {
    private templateSvc: TemplateService
    private router: Router

    private static instance: TemplateRouter

    static getInstance(templateSvc: TemplateService) {
        if (!TemplateRouter.instance) {
            TemplateRouter.instance = new TemplateRouter(templateSvc)
        }
        return TemplateRouter.instance
    }

    private constructor(templateSvc: TemplateService) {
        this.router = Router({
            mergeParams: true,
            caseSensitive: true,
            strict: true,
        })
        this.templateSvc = templateSvc
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
    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = TemplateRequestBody.parse(req.body)
            const result = await this.templateSvc.create(data)
            if (!result) {
                throw new NotCreatedError('Template')
            }
            res.status(201).send()
        } catch (error) {
            next(error)
        }
    }

    /**
 * @swagger
 * /api/v1/template/{id}:
 *   patch:
 *     summary: Update a template by ID
 *     description: Update the template fields by providing a valid template ID and the fields to update.
 *     tags:
 *       - Template
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the template to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional template ID
 *               title:
 *                 type: string
 *                 description: Template title
 *               vocational:
 *                 type: boolean
 *                 description: Indicates if the template is vocational
 *               configTCLEId:
 *                 type: integer
 *                 description: Config TCLE ID
 *               appId:
 *                 type: integer
 *                 description: Application ID
 *     responses:
 *       200:
 *         description: Template successfully updated
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal Server Error
 */
    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = TemplateUpdateRequestBody.parse(req.body)
            const id = zod.string().parse(req.params.id)
            const result = await this.templateSvc.update(data, id)
            if (!result) {
                throw new NotFoundError('Template', 'id')
            }
            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

    /**
 * @swagger
 * /api/v1/template/{id}:
 *   delete:
 *     summary: Delete a template by ID
 *     description: Delete a template by providing a valid template ID.
 *     tags:
 *       - Template
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the template to delete
 *     responses:
 *       200:
 *         description: Template successfully deleted
 *       404:
 *         description: Template not found
 *       500:
 *         description: Internal Server Error
 */
    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = zod.string().parse(req.params.id)
            await this.templateSvc.delete(id)

            res.status(200).send()
        } catch (error) {
            next(error)
        }
    }

    /**
 * @swagger
 * /api/v1/template:
 *   get:
 *     summary: Retrieve all templates
 *     description: Get a list of all available templates.
 *     tags:
 *       - Template
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The template ID
 *                   title:
 *                     type: string
 *                     description: The title of the template
 *                   vocational:
 *                     type: boolean
 *                     description: Indicates if the template is vocational
 *                   configTCLEId:
 *                     type: integer
 *                     description: Config TCLE ID
 *                   appId:
 *                     type: integer
 *                     description: Application ID
 *       500:
 *         description: Internal Server Error
 */
    private async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.templateSvc.findAll()
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


export default TemplateRouter.getInstance
