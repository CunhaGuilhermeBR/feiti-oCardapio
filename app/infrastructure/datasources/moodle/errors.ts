export class MoodleError extends Error {
	constructor(status?: number, errorMessage?: string, route?: string) {
		super(`Erro ao acessar o Moodle na rota ${route} com status [${status}]: ${errorMessage} `)
	}
}

export class NotFoundError extends Error {
	constructor(className?: string, attributeName?: string) {
		super(`${className} ${attributeName} não foi encontrada!`)
	}
}

export class FormatMoodleTokenError extends Error {
	constructor() {
		super('Error on parse moodle token')
	}
}
  
