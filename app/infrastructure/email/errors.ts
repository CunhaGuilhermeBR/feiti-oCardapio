export class EmailError extends Error {
	constructor(to?: string, from?: string) {
		super(`Erro ao enviar o email para ${to} do remetente ${from} `)
	}
}
