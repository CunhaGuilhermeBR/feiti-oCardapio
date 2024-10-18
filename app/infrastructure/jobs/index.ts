import { CronJob } from 'cron'
import { logger } from '../logger'
import { executeVtexJob } from './vtex'
import { executeFeedbackJob } from './notifyPendingFeedbacks'
import { executeCreateFeedbackJob } from './createFeedback'
import { executeCourseEndJob } from './checkCourseEnd'

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
		this.addJob(process.env.VTEX_JOB_TIME, executeVtexJob)
		this.addJob(process.env.FEEDBACK_JOB_TIME, executeFeedbackJob)
		this.addJob(process.env.CREATE_FEEDBACK_JOB_TIME, executeCreateFeedbackJob)
		this.addJob(process.env.CHECK_DEADLINE_JOB_TIME, executeCourseEndJob)
		this.startJobs()
	}
}

export default Jobs.getInstance()

