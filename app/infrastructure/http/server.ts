import express from 'express'
import { ecsFormat } from '@elastic/ecs-morgan-format'
import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { logger } from '@/infrastructure/logger'
import V1Router from '@/infrastructure/http/routes/v1'
import Controllers from '@/infrastructure/http/views/controllers/factories'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { ServerConfig, ServerDTO } from './types'
import path from 'path'
import favicon from 'serve-favicon'
import compression from 'compression'

class Server implements ServerDTO {
	public app: express.Express
	private config: ServerConfig
	private router: express.Router

	constructor(config: ServerConfig) {
		this.config = config
		this.app = express()
		this.router = express.Router()
	}

	private async init(): Promise<void> {
		await prisma.$connect()
		this.setupRateLimit()
		this.setupMiddlewares()
		this.setupRoutes()
		this.setupSwagger()
		Controllers(this.app)
	}


	private setupSwagger(): void {
		const options = {
			definition: {
				openapi: '3.0.0',
				info: {
					title: 'Cardápio Feitiço de Santa',
					version: '1.0.0',
					description: 'Cardápio Feitiço de Santa API',
				},
				// components: {
				//   securitySchemes: {
				//     bearerAuth: {
				//       type: "http",
				//       scheme: "bearer",
				//       bearerFormat: "JWT",
				//     },
				//   },
				// },
				// security: [
				//   {
				//     bearerAuth: [],
				//   },
				// ],
			},
			// NEED IMPROVE
			apis: [
				'./app/infrastructure/http/routes/*/*.ts',
				'./app/infrastructure/http/routes/*/*/*.ts',
				'./app/infrastructure/http/routes/*/*/*/*.ts',
			],
		}
		const swaggerSpec = swaggerJSDoc(options)
		this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
	}


	private setupRateLimit(): void {
		// const limiter = rateLimit({
		// 	store: new RedisStoreRateLimit({
		// 		// @ts-expect-error - sendCommand is not defined in the type
		// 		sendCommand: (...args: string[]) => redis.sendCommand(args),
		// 		prefix: 'rate-limit:',
		// 	}),
		// 	validate: {
		// 		xForwardedForHeader: false
		// 	},
		// 	windowMs: 60 * 1000,
		// 	limit: 60,
		// 	message: 'Too many requests from this User or IP, please try again in a minute!',
		// 	skipFailedRequests: true,
		// 	statusCode: 429,
		// })
		// this.app.use(limiter)
	}


	private setupCors(): void {
		this.app.use((req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*')
			res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
			res.header([
				'Origin',
				'X-Requested-With',
				'Content-Type',
				'Accept',
				'Authorization',
				'token',
				'hx-request',
				'hx-target',
				'hx-trigger'])
			res.header('Access-Control-Allow-Credentials', 'true')

			if (req.method === 'OPTIONS') {
				return res.sendStatus(200)
			}

			next()
		})
	}

	async start(): Promise<void> {
		await this.init()
		logger.info(
			`Server listening on ${this.config.address}:${this.config.port} on ${process.env.NODE_ENV} mode`
		)
		this.app
			.listen(this.config.port, this.config.address)
			.on('error', (err) => {
				logger.error(err)
				this.shutdown()
			})
	}

	private setupRoutes(): void {
		const v1 = V1Router.getRouter()
		this.router.use('/v1', v1)
		this.app.use('/api', this.router)
	}

	private setupMiddlewares(): void {
		this.app.use(compression())
		this.app.use(morgan(ecsFormat({ format: 'dev' })))
		this.app.set('views', path.join(__dirname, 'views/pages'))
		this.app.set('view engine', 'pug')
		this.app.use(
			'/public',
			express.static(path.join(__dirname, 'views/public'), { maxAge: 60000 })
		)
		// https://expressjs.com/en/resources/middleware/serve-favicon.html
		this.app.use(
			favicon(path.join(__dirname, 'views/public', 'favicon.ico'))
		)
		this.app.enable('view cache')
		this.app.use(express.json())
		this.app.use(express.urlencoded({ extended: true }))
		this.setupCors()
		process.on('uncaughtException', (error: Error) => {
			logger.error('Uncaught Exception:', error)
			// this.shutdown()
		})
	}

	shutdown(): void {
		logger.info('Shutting down server')
		prisma.$disconnect().catch((error) => {
			logger.error('Error disconnecting from Prisma:', error)
		})
		process.exit(1)
	}
}

export default Server
