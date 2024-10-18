export class UnauthorizedError extends Error {
	constructor() {
		super('User dont have a authorization')
	}
}
