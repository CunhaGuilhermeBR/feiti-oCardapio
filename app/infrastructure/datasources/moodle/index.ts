import { logger } from '@/infrastructure/logger'
import { DOMParser } from 'xmldom'
import { FormatMoodleTokenError, MoodleError, NotFoundError } from './errors'
import {
	GetAssignmentsResponse,
	KeyValuesGetFunction,
	MoodleAddFeedbackToAssignmentDTO,
	MoodleFunction,
	MoodleGetSubmissionResponse,
	MoodleGetUserResponse,
	MoodleMethod,
	MoodleRequest,
	MoodleTokenData
} from './types'

export default class MoodleWrapper {
	private baseUrl: string
	private token: string
	private parser: DOMParser
	private static instance: MoodleWrapper

	static getInstance() {
		if (!MoodleWrapper.instance) {
			MoodleWrapper.instance = new MoodleWrapper()
		}
		return MoodleWrapper.instance
	}

	constructor() {
		this.parser = new DOMParser()
		this.baseUrl = process.env.MOODLE_URL
		this.token = process.env.MOODLE_TOKEN
	}

	public async getUserByCriteria(key: KeyValuesGetFunction, value: string): Promise<MoodleGetUserResponse> {
		const params = new URLSearchParams()

		params.append('criteria[0][key]', key)
		params.append('criteria[0][value]', value)
		return await this.fetchMoodle({
			method: MoodleMethod.GET,
			function: MoodleFunction.CORE_USER_GET_USERS,
			params
		}) as MoodleGetUserResponse
	}

	public addEssentialsCourses(coursesId: number[]) {
		// This is a request made to auto enrol student on essentials courses
		coursesId.push(97)
		coursesId.push(76)
		coursesId.push(79)
		return coursesId
	}

	public async addUserToCourse(userId: string, courseId: number): Promise<void> {
		const params = new URLSearchParams()

		params.append('enrolments[0][roleid]', '5')
		params.append('enrolments[0][userid]', userId)
		params.append('enrolments[0][courseid]', courseId.toString())
		await this.fetchMoodle({
			method: MoodleMethod.POST,
			function: MoodleFunction.ENROL_MANUAL_ENROL_USERS,
			params
		})
	}

	public async addFeedbackToAssignment(data: MoodleAddFeedbackToAssignmentDTO): Promise<unknown> {
		const userMoodle = (await this.getUserByCriteria(KeyValuesGetFunction.EMAIL, data.email)).users[0]
		if (!userMoodle) {
			throw new NotFoundError('User in Moodle', 'Email')
		}

		const feedbackInMoodle =
			`<div style="text-align: left;">
               <a href="${data.experienceUrl}">
                 Fazer download do Portfólio de Vivências!
               </a>
             <br>
             <a href="${data.feedbackUrl}">
               Fazer download da Devolutiva de Portfólio de Vivências!
             </a>
             </div>`

		const params = new URLSearchParams({
			assignmentid: encodeURIComponent(data.moodleAssignmentId),
			userId: encodeURIComponent(userMoodle.id),
			grade: '90',
			attemptnumber: '-1',
			addattempt: '0',
			applytoall: '0',
			workflowstate: 'grade'
		})

		params.append('plugindata[assignfeedbackcomments_editor][format]', '1')
		params.append('plugindata[assignfeedbackcomments_editor][text]', feedbackInMoodle)

		return await this.fetchMoodle({
			method: MoodleMethod.POST,
			function: MoodleFunction.MOD_ASSIGN_SAVE_GRADE,
			params
		})
	}

	public async getSubmissionByAssignment(moodleAssignmentId: number): Promise<MoodleGetSubmissionResponse> {
		const params = new URLSearchParams()
		params.append('assignmentids[0]', moodleAssignmentId.toString())
		return await this.fetchMoodle({
			method: MoodleMethod.GET,
			function: MoodleFunction.MOD_ASSIGN_GET_SUBSMISSIONS,
			params
		}) as MoodleGetSubmissionResponse
	}

	public async getMoodleTasks(): Promise<GetAssignmentsResponse> {
		const params = new URLSearchParams()
		return await this.fetchMoodle({
			method: MoodleMethod.GET,
			function: MoodleFunction.MOD_ASSIGN_GET_ASSIGNMENTS,
			params
		}) as GetAssignmentsResponse
	}

	public parserMoodleToken(token: string): MoodleTokenData {
		logger.info('Parsing token')
		const pattern = /SPKCI(\d+)UID(\d+)UILA(\d+)SPKCE/g
		const match = pattern.exec(token)

		const notMatched = !match || match.length <= 0
		if (notMatched) {
			throw new FormatMoodleTokenError()
		}

		const response: MoodleTokenData = {
			id: match[2],
			firstAccess: +match[1],
			lastAccess: +match[3]
		}

		logger.info('Token parsed')

		return response
	}

	private async fetchMoodle(
		moodleRequest: MoodleRequest
	): Promise<unknown> {
		logger.info(`Trying to fetch Moodle data for function: ${moodleRequest.function}`)
		const options: RequestInit = {
			method: moodleRequest.method.toUpperCase(),
			headers: {
				'content-type': 'application/json',
				token: this.token,
			} as HeadersInit,
		}

		const url = encodeURI(`${this.baseUrl}?wstoken=${this.token}&wsfunction=${moodleRequest.function}` +
			'&moodlewsrestformat=json')
		const response = await fetch(`${url}&${moodleRequest.params}`, options)

		if (!response.ok) {
			throw new MoodleError(response.status, response.statusText, moodleRequest.function)
		}

		return await response.json() as unknown
	}
}
