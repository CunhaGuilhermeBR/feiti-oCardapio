import { Request, Response, NextFunction } from 'express'
import { logger } from '@/infrastructure/logger'
import { NotFoundError, PartialProcessed } from '@/services/errors'
import zod from 'zod'
import {
	TemplateNotInserted,
	UserDataNotFound,
} from '@/infrastructure/http/routes/v1/authentication/errors'
import { PageRenderData } from '../views/controllers/configurableItem/types'
import {
	SpeckBadRequestError,
	SpeckError,
} from '@/infrastructure/datasources/speck/errors'
import { SessionNotFound } from '@/infrastructure/http/views/controllers/errors'
import { NotAllTermsAreAccepted } from '../routes/v1/speckResult/errors'

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	if (res.headersSent) {
		return next(err)
	}

	if (err instanceof zod.ZodError) {
		logger.http(err.message)
		res.status(404).json({
			error: 'Invalid input. Please check your request body. ' + err.message,
		})
		return
	}

	// if (err instanceof NotFoundError) {
	// 	logger.http(err.message)
	// 	res.status(404).json({ error: err.message })
	// 	return
	// }

	// if (err instanceof PartialProcessed) {
	// 	logger.http(err.message)
	// 	res.status(207).json({ error: err.message })
	// 	return
	// }

	// if (err instanceof UserDataNotFound) {
	// 	logger.http(err.message)
	// 	res.status(422).json({ error: err.message })
	// 	return
	// }

	// if (err instanceof TemplateNotInserted) {
	// 	logger.http(err)
	// 	res.status(422).json({ error: err.message })
	// 	return
	// }

	// if (err instanceof SpeckBadRequestError) {
	// 	logger.http(err)
	// 	res.status(400).json({ error: err.message })
	// 	return
	// }

	// if (err instanceof SpeckError) {
	// 	logger.http(err)
	// 	res.status(500).json({ error: err.message })
	// 	return
	// }

	if (err instanceof NotAllTermsAreAccepted) {
		logger.http(err)
		res.status(422).json({ error: err.message })
		return
	}

	logger.error(err)
	res.status(500).json({ error: 'Internal Server Error' })
	next(err)
}

export function pageErrorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	next: NextFunction,
) {
	if (res.headersSent) {
		return next(err)
	}

	const pageRenderData: PageRenderData = {
		title: 'Ops! Algo deu errado',
		imageUrl: '../public/assets/icons/important.svg',
		logoImageUrl:
			'https://speck-ead-pdf.s3.br-sao.cloud-object-storage.appdomain.cloud/speck-images/speck-logo.svg',
		description: 'Internal Server Error',
	}

	let status = 500
	if (err instanceof zod.ZodError) {
		logger.http(err.message)
		pageRenderData.description =
			'Houve um problema no carregamento da página, por favor faça o login novamente, clicando no link enviado por e-mail.<br> <br>Caso precise de ajuda, entre em contato com o suporte através do e-mail <a style="color: white; font-weight: bold; text-decoration: underline;" href="mailto:atendimento@specktech.com.br">atendimento@specktech.com.br</a> '
		status = 404
	}

	// if (err instanceof NotFoundError) {
	// 	logger.http(err.message)
	// 	pageRenderData.description = err.message
	// 	status = 404
	// }

	// if (err instanceof PartialProcessed) {
	// 	logger.http(err.message)
	// 	pageRenderData.description = err.message
	// 	status = 207
	// }

	// if (err instanceof UserDataNotFound) {
	// 	logger.http(err.message)
	// 	pageRenderData.description = err.message
	// 	status = 422
	// }

	// if (err instanceof TemplateNotInserted) {
	// 	logger.http(err)
	// 	pageRenderData.description = err.message
	// 	status = 422
	// }

	// if (err instanceof SpeckBadRequestError) {
	// 	logger.http(err)
	// 	pageRenderData.description = err.message
	// 	status = 400
	// }

	// if (err instanceof SpeckError) {
	// 	logger.http(err)
	// 	pageRenderData.description = err.message
	// 	status = 500
	// }

	if (err instanceof SessionNotFound) {
		logger.http(err)
		pageRenderData.description = err.message
		status = 401
	}

	logger.error(err)

	res.status(status).render('page', pageRenderData)
}
