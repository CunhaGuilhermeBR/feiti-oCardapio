export class UserDataNotFound extends Error {
	constructor(contact?: unknown, orderNumber?: string) {
		super(`User data not found Contact: ${contact} Order Info: ${orderNumber}`)
	}
}

export class TemplateNotInserted extends Error {
	constructor() {
		super('No templates inserted!')
	}
}

export class InvalidData extends Error {
	constructor() {
		super('Invalid data on Moodle Token!')
	}
}