import { z } from 'zod'

enum NODE_ENV {
	DEV = 'development',
	PROD = 'production',
}

const envSchema = z.object({
	DATABASE_URL: z.string(),
	REDIS_URI: z.string(),
	REDIS_PASSWORD: z.string().optional(),

	APP_PORT: z.coerce.number().default(8080),
	APP_HOST: z.string().optional().default('0.0.0.0'),

	NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.DEV),
	SESSION_SECRET: z.string().optional().default('keyboard cat'),
	OPENAI_API_KEY: z.string(),

	MOODLE_URL: z.string(),
	MOODLE_TOKEN: z.string(),

	COS_ENDPOINT: z.string(),
	COS_API_KEY: z.string(),
	COS_SERVICE_INSTANCE: z.string(),
	COS_BUCKET: z.string(),

	RABBIT_STRING_CONNECTION: z.string(),
	SPECK_PUBLISH_QUEUE: z.string(),
	SPECK_CONSUME_QUEUE: z.string(),
	SPECK_ERROR_QUEUE: z.string(),

	VTEX_URL: z.string(),
	VTEX_APP_TOKEN: z.string(),
	VTEX_APP_KEY: z.string(),
	VTEX_APP_URL: z.string(),
	VTEX_JOB_TIME: z.string(),

	EAD_URL: z.string(),
	FEEDBACK_JOB_TIME: z.string(),
	COURSES_DAYS: z.number().positive(),
	CREATE_FEEDBACK_JOB_TIME: z.string(),
	CHECK_DEADLINE_JOB_TIME: z.string(),
	DEFAULT_EAD_TEMPLATE: z.string(),
	MOODLE_CONSENT_TERM_ID: z.number()
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	throw new Error(
		'Invalid environment variables: ' +
      JSON.stringify(_env.error?.format(), null, 2)
	)
}
