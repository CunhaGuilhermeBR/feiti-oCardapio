export class COSError extends Error {
	constructor(bucket?: string, errorMessage?: string) {
		super(`Erro ao acessar o bucket ${bucket} com a mensagem: ${errorMessage} `)
	}
}
    