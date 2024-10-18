import { NextFunction, Request, Response, Router } from 'express'
import { NotCreatedError } from '@/services/errors'
import { AcceptTCLEFieldCreateSchema } from './types'
import { ConsentTermService } from '@/services/consentTerm'

export class AccecptTCLERouter {
  private consentTermSvc: ConsentTermService
  private router: Router

  private static instance: AccecptTCLERouter

  static getInstance(consentTermSvc: ConsentTermService) {
    if (!AccecptTCLERouter.instance) {
      AccecptTCLERouter.instance = new AccecptTCLERouter(consentTermSvc)
    }
    return AccecptTCLERouter.instance
  }

  private constructor(consentTermSvc: ConsentTermService) {
    this.router = Router({
      mergeParams: true,
      caseSensitive: true,
      strict: true,
    })
    this.consentTermSvc = consentTermSvc
    this.setupMiddlewares()
    this.setupRoutes()
  }

  /**
  * @swagger
  * /api/v1/accept-tcle:
  *   post:
  *     summary: Create a new acceptance of TCLE (Termo de Consentimento Livre e Esclarecido)
  *     description: Create a new acceptance of TCLE with the provided data
  *     tags:
  *       - AcceptTCLE
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/AcceptTCLECreateRequestBody'
  *     responses:
  *       201:
  *         description: Successfully created the acceptance of TCLE
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/AcceptTCLEResponse'
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Internal Server Error
  * components:
  *   schemas:
  *     AcceptTCLECreateRequestBody:
  *       type: object
  *       properties:
  *         saleId:
  *           type: string
  *           description: The ID of the sale
  *         ConfigConsentTermCheckFieldsId:
  *           type: string
  *           description: The ID of the configuration consent term check fields
  *     AcceptTCLEResponse:
  *       type: object
  *       properties:
  *         saleId:
  *           type: string
  *         ConfigConsentTermCheckFieldsId:
  *           type: string
  *         acceptanceDate:
  *           type: string
  *           format: date-time
  *           description: The date and time when the acceptance was created
  */
  private async createAcceptTCLE(req: Request, res: Response, next: NextFunction) {
    try {
      const data = AcceptTCLEFieldCreateSchema.parse(req.body)
      const result = await this.consentTermSvc.create(data)
      if (!result) {
        throw new NotCreatedError('Consent term')
      }
      res.status(201).json(result)
    } catch (error) {
      next(error)
    }
  }

  

  private setupRoutes() {
    this.router.post('/', this.createAcceptTCLE.bind(this))
  }

  private setupMiddlewares() { }

  public getRouter() {
    return this.router
  }
}


export default AccecptTCLERouter.getInstance
