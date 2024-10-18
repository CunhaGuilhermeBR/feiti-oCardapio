export class NotAllTermsAreAccepted extends Error {
	constructor() {
		super('Not all terms are accepted')
	}
}

export class ErrorToPublishMessage extends Error {
	constructor() {
		super('Error to publish message on RabbitMQ')
	}
}
    