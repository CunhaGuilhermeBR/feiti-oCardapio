export class SpeckError extends Error {
	constructor(status?: number, errorMessage?: string) {
		super(`Erro ao acessar a API do SPECK com status [${status}]: ${errorMessage} `)
	}
}

export class SpeckBadRequestError extends Error {
	constructor() {
		super('Erro de requisição ao enviar amostra para o SPECK')
	}
}
