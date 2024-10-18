import { Course, PrismaClient } from '@prisma/client'

export class CourseRepository {
	private prisma: PrismaClient

	private static instance: CourseRepository

	public static getInstance(prisma: PrismaClient) {
		if (!this.instance) {
			this.instance = new CourseRepository(prisma)
		}
		return this.instance
	}

	private constructor(prisma: PrismaClient) {
		this.prisma = prisma
	}

	public async findByShortName(courseName: string): Promise<Course> {
		return await this.prisma.course.findUniqueOrThrow({
			where: {
				shortName: courseName
			}
		})
	}

	public async findAll(): Promise<Course[]> {
		return await this.prisma.course.findMany({
			orderBy: [
				{
					bigFive: 'asc',
				},
				{
					moodleId: 'asc'
				}
			]
		})
	}
}