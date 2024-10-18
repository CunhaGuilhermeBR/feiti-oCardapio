import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { MoodleSubmissionRepository } from '@/repositories/moodleSubmission'

class MakeMoodleSubmissionRepository {
	private constructor() {}

	public static execute(): MoodleSubmissionRepository {
		return MoodleSubmissionRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeMoodleSubmissionRepository.execute()
