import { prisma } from '@/infrastructure/datasources/databases/prisma'
import redis from '@/infrastructure/datasources/databases/redis'
import { MoodleTaskRepository } from '@/repositories/moodleTask'

class MakeMoodleTaskRepository {
	private constructor() {}

	public static execute(): MoodleTaskRepository {
		return MoodleTaskRepository.getInstance(
			prisma,
			redis
		)
	}
}

export default MakeMoodleTaskRepository.execute()
