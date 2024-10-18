export class VTEXError extends Error {
	constructor(errorMessage?: string) {
		super(`Erro ao acessar a VTEX com a mensagem: ${errorMessage} `)
	}
}
    