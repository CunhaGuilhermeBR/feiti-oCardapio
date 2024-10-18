export class SessionNotFound extends Error {
	constructor() {
		super(`
            Sua sessão expirou, por favor faça login novamente, clicando no link enviado por e-mail. <br>            
            Caso precise de ajuda, entre em contato com o suporte através do e-mail <a style="color: white; font-weight: bold; text-decoration: underline;" href="mailto:atendimento@specktech.com.br">atendimento@specktech.com.br</a>
            `)
	}
}
