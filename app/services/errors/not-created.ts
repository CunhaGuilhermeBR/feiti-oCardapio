export class NotCreatedError extends Error {
	constructor(className?: string) {
		super(`Houve um erro na criação da instância de ${className}!`)
	}
}
  