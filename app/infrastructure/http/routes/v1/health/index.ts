import { NextFunction, Request, Response, Router } from 'express'
import { logger } from '@/infrastructure/logger'
import { collectDefaultMetrics, register } from 'prom-client'
import { prisma } from '@/infrastructure/datasources/databases/prisma'
import os from 'os'

export class HealthRouter {
	private router: Router
	private static instance: HealthRouter

	static getInstance(): HealthRouter {
		if (!HealthRouter.instance) {
			HealthRouter.instance = new HealthRouter()
		}
		return HealthRouter.instance
	}

	private constructor() {
		collectDefaultMetrics()

		this.router = Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
          
		this.setupRoutes()
	}

	/**
	 * @swagger
	 *
	 * /api/v1/health/metrics:
	 *   get:
	 *     summary: Collects metrics
	 *     description: Endpoint to collect metrics
	 *     tags:
	 *       - Health
	 *     responses:
	 *       '200':
	 *         description: OK. Metrics collected successfully.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *       '500':
	 *         description: Internal Server Error. Something went wrong on the server side.
	 */
	private async metrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			logger.info('Collecting metrics')
			res.set('Content-Type', register.contentType)
			res.end(await register.metrics())
		} catch (error) {
			next(error)
		}
	}

	/**
	 * @swagger
	 *
	 * /api/v1/health/ping:
	 *   get:
	 *     summary: Ping
	 *     description: Pong
	 *     tags:
	 *       - Health
	 *     responses:
	 *       '200':
	 *         description: OK.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *       '500':
	 *         description: Internal Server Error. Something went wrong on the server side.
	 */
	private async ping(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			logger.info('Pinging')
			res.status(200).json(
				{ 
					message: 'Pong',
					severUptime: os.uptime(),
					serverTime: new Date().toISOString(),
				})
		} catch (error) {
			next(error)
		}
	}

	/**
	 * @swagger
	 *
	 * /api/v1/health/health:
	 *   get:
	 *     summary: Collects health
	 *     description: Endpoint to collect metrics
	 *     tags:
	 *       - Health
	 *     responses:
	 *       '200':
	 *         description: OK. Metrics collected successfully.
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 message:
	 *                   type: string
	 *       '500':
	 *         description: Internal Server Error. Something went wrong on the server side.
	 */

	private async health(_req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			logger.info('Checking health')
			// verify if prisma is connected
			const prismaResult = await prisma.$queryRaw`SELECT 1` as any

			let prismaStatus = 'UNHEALTH'

			if (prismaResult[0]['?column?'] === 1) {
				prismaStatus = 'HEALTH'
			}

			const health = {
				postgres: prismaStatus,
				CPU: {
					usage: os.cpus()
				},
				Memory: {
					free: os.freemem(),
					total: os.totalmem(),
				},
			}

			res.status(200).json(health)
		} catch (error) {
			next(error)
		}
	}


	private setupRoutes(): void {
		this.router.get('/metrics', this.metrics.bind(this))
		this.router.get('/ping', this.ping.bind(this))
		this.router.get('/health', this.health.bind(this))
	}

	public getRouter(): Router {
		return this.router
	}
}

export default HealthRouter.getInstance
