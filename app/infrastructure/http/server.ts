import express from 'express'
import { ecsFormat } from '@elastic/ecs-morgan-format'
import { prisma } from '@/infrastructure/datasources/databases/prisma'
import { logger } from '@/infrastructure/logger'
import { errorHandler } from '@/infrastructure/http/middlewares'
import V1Router from '@/infrastructure/http/routes/v1'
import Controllers from '@/infrastructure/http/views/controllers/factories'
import Jobs from '@/infrastructure/jobs'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'
import { ServerConfig, ServerDTO } from './types'
import path from 'path'
import favicon from 'serve-favicon'
import compression from 'compression'
import session from 'express-session'
import redis from '@/infrastructure/datasources/databases/redis'
import { RedisStore as RedisStoreRateLimit } from 'rate-limit-redis'
import rateLimit from 'express-rate-limit'
import RedisStore from 'connect-redis'
import RabbitMQWrapper from '@/infrastructure/datasources/rabbitMQ'


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
		this.setupJobs()
		this.setupRateLimit()
		this.setupMiddlewares()
		this.setupRoutes()
		this.setupSwagger()
		Controllers(this.app)
		// https://stackoverflow.com/questions/29700005/express-4-middleware-error-handler-not-being-called
		this.setupErrorHandlers()
		await RabbitMQWrapper.getInstance()
	}

	private setupJobs(): void {
		Jobs.setupJobs()
	}

	private setupSwagger(): void {
		const options = {
			definition: {
				openapi: '3.0.0',
				info: {
					title: 'AWSA Reforged',
					version: '1.0.0',
					description: 'AWSA Reforged API',
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

	private setupErrorHandlers(): void {
		this.app.use(errorHandler)
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
			res.header('Access-Control-Allow-Origin', 'https://speckead.com.br')
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
		this.app.use(session({
			store: new RedisStore({
				client: redis,
				prefix: 'session:',
			}),
			// proxy: true,
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				// SÓ SETAR COMO TRUE SE FOR USAR HTTPS
				secure: process.env.NODE_ENV === 'production' ? true : false,
				// maxAge: 1000 * 60 * 60 * 24 // 24 hours
				maxAge: 1000 * 60 * 60 // 1 hour
			}
		}))
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
