import { Request, Response, NextFunction } from 'express'
import path from 'path'
import fs from 'fs'
import { logger } from '@/infrastructure/logger'

// https://stackoverflow.com/questions/24582338/how-can-i-include-css-files-using-node-express-and-ejs/24582622#24582622
// Camarada, eu fiquei uma semana tentando resolver isso, e a solução foi essa gambiarra horrenda aqui.
// Se você souber de uma solução mais inteligente e perspicaz, me avisa.
// Caso eu não esteja mais na empresa, meu e-mail é: mun1t0@duck.com
export function handlerNestedFiles(req: Request, res: Response, next: NextFunction) {
	const extName = path.extname(req.url)

	const supportedExtensions = ['.js', '.html', '.css', '.svg']
	if (supportedExtensions.includes(extName)) {
		logger.info('Original req.url:', req.url)
		const segments = req.url.split('/')
		const publicIndex = segments.indexOf('public')
        
		const publicIndexIsFirst = publicIndex == -1 || publicIndex == 0
		if (publicIndexIsFirst) {
			next()
		}

		req.url = '/' + segments.slice(publicIndex).join('/')

		logger.info('Adjusted req.url:', req.url)
	}

	const filePath = path.join(
		__dirname,
		'views',
		req.url
	)

	logger.info('Final filePath:', filePath)

	const getContentType = (ext: string) => {
		switch (ext) {
		case '.css': return 'text/css'
		case '.js': return 'text/javascript'
		case '.json': return 'application/json'
		case '.png': return 'image/png'
		case '.jpg': return 'image/jpg'
		case '.svg': return 'image/svg+xml'
		default: return 'text/html'
		}
	}
	const contentType = getContentType(extName)

	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			logger.error('File not found:', err)
			next()
		} else {
			res.writeHead(200, { 'Content-Type': contentType })
			const readStream = fs.createReadStream(filePath)

			readStream.on('error', (streamErr) => {
				logger.error('Stream error:', streamErr)
				next()
			})

			readStream.pipe(res)
			readStream.on('end', () => {
				logger.info('Stream ended')
				res.end()
			})
		}
	})
}