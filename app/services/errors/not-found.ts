export class NotFoundError extends Error {
	constructor(className?: string, attributeName?: string) {
		super(`${className} ${attributeName} não foi encontrada!`)
	}
}
