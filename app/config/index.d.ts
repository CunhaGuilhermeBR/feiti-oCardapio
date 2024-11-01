import { z } from 'zod'

enum NODE_ENV {
	DEV = 'development',
	PROD = 'production',
}

const envSchema = z.object({
	DATABASE_URL: z.string(),

	APP_PORT: z.coerce.number().default(8080),
	APP_HOST: z.string().optional().default('0.0.0.0'),

	NODE_ENV: z.nativeEnum(NODE_ENV).default(NODE_ENV.DEV),
	SESSION_SECRET: z.string().optional().default('keyboard cat'),

	COS_ENDPOINT: z.string(),
	COS_API_KEY: z.string(),
	COS_SERVICE_INSTANCE: z.string(),
	COS_BUCKET: z.string(),

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
