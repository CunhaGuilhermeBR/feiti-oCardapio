import { logger } from '../logger'
import nodemailer from 'nodemailer'
import pug from 'pug'
import path from 'path'
import { EmailError } from './errors'

export const sendAccessEmail = async (emailData: EmailData) => {
	try {
		const transporter = nodemailer.createTransport({
			host: emailData.host,
			port: emailData.port,
			auth: {
				user: emailData.applicationEmail,
				pass: emailData.applicationEmailPassword,
			},
			secure: true,
			tls: {
				rejectUnauthorized: false,
			},
			logger: false,
			debug: false
		})

		const templatePath = path.join(
			process.cwd(),
			'app', 'infrastructure', 'email', 'templates', 'access_email.pug'
		)
		const html = pug.renderFile(templatePath, {
			username: emailData.name,
			accessLink: emailData.link,
		})

		const email = `no-reply@${emailData.domain}`

		checkEmail(email, emailData.to, emailData.applicationEmail)

		const mailOptions: MailOptions = {
			from: `"Speck" <${email}>`,
			to: emailData.to,
			subject: emailData.subject,
			html,
		}


		const info = await transporter.sendMail(mailOptions)

		logger.info(`Email sent: ${info.messageId}`)
	} catch (error) {
		logger.error(emailData.to + emailData.applicationEmail + '@' + emailData.domain + '\n' + error)
		throw new EmailError(emailData.to, emailData.applicationEmail + '@' + emailData.domain + '\n' + error)
	}
}

export const sendDownloadEmail = async (emailData: EmailData) => {
	try {
		const transporter = nodemailer.createTransport({
			host: emailData.host,
			port: emailData.port,
			auth: {
				user: emailData.applicationEmail,
				pass: emailData.applicationEmailPassword,
			},
			secure: true,
			tls: {
				rejectUnauthorized: false,
			},
			logger: false,
			debug: false
		})

		const templatePath = path.join(
			process.cwd(),
			'app', 'infrastructure', 'email', 'templates', 'download_email.pug'
		)
		const html = pug.renderFile(templatePath, {
			username: emailData.name,
			accessLink: emailData.link,
		})

		const email = `no-reply@${emailData.domain}`

		checkEmail(email, emailData.to, emailData.applicationEmail)

		const mailOptions: MailOptions = {
			from: `"Speck" <${email}>`,
			to: emailData.to,
			subject: emailData.subject,
			html,
		}


		const info = await transporter.sendMail(mailOptions)

		logger.info(`Email sent: ${info.messageId}`)
	} catch (error) {
		logger.error(emailData.to + emailData.applicationEmail + '@' + emailData.domain + '\n' + error)
		throw new EmailError(emailData.to, emailData.applicationEmail + '@' + emailData.domain + '\n' + error)
	}
}

export const sendGenericEmail = async (emailData: EmailData, html: string) => {
	const transporter = nodemailer.createTransport({
		host: emailData.host,
		port: emailData.port,
		auth: {
			user: emailData.applicationEmail,
			pass: emailData.applicationEmailPassword,
		},
		secure: true,
		tls: {
			rejectUnauthorized: false,
		},
		logger: false,
		debug: false
	})

	const email = `no-reply@${emailData.domain}`
	checkEmail(email, emailData.to, emailData.applicationEmail)

	const mailOptions: MailOptions = {
		from: `"Speck" <${email}>`,
		to: emailData.to,
		subject: emailData.subject,
		html,
	}

	const info = await transporter.sendMail(mailOptions)

	logger.info(`Email sent: ${info.messageId}`)
}


function checkEmail(email: string, to: string, from: string) {
	// Verify if are valid emails
	// https://regexr.com/2rhq7
	const regex = new RegExp(
		'[a-z0-9!#$%&\'*+/=?^_`{|}~-]+' +
		'(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*' +
		'@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+' +
		'[a-z0-9](?:[a-z0-9-]*[a-z0-9])?'
	)
	if (!regex.test(email)) {
		throw new EmailError(to, from)
	}
}