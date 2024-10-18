import { logger } from '@/infrastructure/logger'
import { createClient } from 'redis'
import { RedisConnection } from 'redis-om'

class RedisSingleton {
	// Static instance variable
	static instance: RedisConnection

	// Static method to get the singleton instance
	static getInstance() {
		if (!RedisSingleton.instance) {
			RedisSingleton.instance = createClient({
				url: process.env.REDIS_URI ?? 'redis://localhost:6379/0',
			})

			// Connect and authenticate
			RedisSingleton.instance.connect()
			
			RedisSingleton.instance.on('error', (error) => {
				logger.error('Redis connection error: ' + error)
			})
			RedisSingleton.instance.on('connect', () => {
				logger.info('Redis connection established')
			})
		}
		return RedisSingleton.instance
	}
}

// Export the singleton instance
export default RedisSingleton.getInstance()
