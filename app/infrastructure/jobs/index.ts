import { CronJob } from 'cron'
import { logger } from '../logger'

class Jobs {
	private static instance: Jobs
	private jobs: CronJob[] = []

	private constructor() { }

	public static getInstance(): Jobs {
		if (!Jobs.instance) {
			Jobs.instance = new Jobs()
		}
		return Jobs.instance
	}

	public addJob(time: string | Date,
		processFunc: () => Promise<void>
	): void {
		const job = CronJob.from({
			cronTime: time,
			onTick: processFunc,
			start: true,
			timeZone: 'America/Sao_Paulo'
		})
		this.jobs.push(job)
	}

	public startJobs(): void {
		logger.info('Starting jobs')
		this.jobs.forEach((job) =>
			job.start()
		)

		logger.info('Jobs started')
	}

	public stopJobs(): void {
		this.jobs.forEach((job) => job.stop())
	}

	public setupJobs(): void {
		logger.info('Setting up jobs')
		this.startJobs()
	}
}

export default Jobs.getInstance()

