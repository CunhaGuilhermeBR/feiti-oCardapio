import { logger } from '@/infrastructure/logger'
import { TutorRepository } from '@/repositories/tutor'
import { NotFoundError, UnauthorizedError } from '@/services/errors'
import { TutorDTO, UpdateTutorDTO } from './types'
import bcrypt from 'bcryptjs'

export class TutorService {
	private tutorRepository: TutorRepository
	private static instance: TutorService

	public static getInstance(
		tutorRepository: TutorRepository) {
		if (!this.instance) {
			this.instance = new TutorService(tutorRepository)
		}
		return this.instance
	}

	private constructor(
		tutorRepository: TutorRepository) {
		this.tutorRepository = tutorRepository
	}

	public async create(data: TutorDTO) {
		logger.info(`Creating Tutor for body: ${data}`)
		data.password = await bcrypt.hash(data.password, 10)
		return await this.tutorRepository.create(data)
	}

	public async findAll() {
		logger.info('Finding all Tutors')
		const result = await this.tutorRepository.findAll()
		if (!result) {
			throw new NotFoundError('Tutor', 'all')
		}
		return result
	}

	public async update(data: UpdateTutorDTO, id: string) {
		logger.info(`Update Tutor for id: ${id}`)
		return await this.tutorRepository.update(id, data)
	}

	public async delete(id: string){
		logger.info(`Delete Tutor for id: ${id}`)
		return await this.tutorRepository.delete(id)
	}

	public async login(email: string, password: string){
		logger.info('Login tutor')
		const tutor = await this.tutorRepository.findByEmail(email)
		if(!tutor){
			throw new NotFoundError('Tutor', 'email')
		}
		if(!await bcrypt.compare(password, tutor.password)){
			throw new UnauthorizedError()
		}
		return tutor
	}
}
