import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express'
import { RecommendationData, RecommendationPageRenderData } from './types'
import { RecommendationService } from '@/services/recommendation'
import { SessionNotFound } from '../errors'
import { z } from 'zod'

export class RecommendationController {
	private router: Router
	private application: Application
	private recommendationService: RecommendationService

	private static instance: RecommendationController

	static getInstance(
		application: Application,
		recommendationService: RecommendationService,
	) {
		if (!RecommendationController.instance) {
			RecommendationController.instance = new RecommendationController(
				application,
				recommendationService,
			)
		}
		return RecommendationController.instance
	}

	private constructor(
		application: Application,
		recommendationService: RecommendationService,
	) {
		this.router = express.Router({
			mergeParams: true,
			caseSensitive: true,
			strict: true,
		})
		this.application = application
		this.recommendationService = recommendationService
		this.setupMiddlewares()
		this.setupRoutes()
		this.application.use('/', this.router)
	}

	private async getRecommendationPage(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			res.render('recommendation/recommendation', {
				title: 'CURSOS BIG FIVE',
				logoUrl: '../public/assets/logos/Logo-Speck-EAD.svg',
				leaveButton: 'Sair',
				starIcon: '../public/assets/icons/star.png',
				buttonText: 'Matricular',
				spanInfo: 'Esse é um curso recomendado para você',
				pBodyContent:
					'Veja as opções de cursos para matrícula. Os cursos marcados com estrela são recomendados para você. <br/> Escolha os 3 que mais te interessam e clique em matricular',
			})
		} catch (error) {
			next(error)
		}
	}

	private setupRoutes() {
		this.router.get(
			'/recommendation/:interviewId',
			this.getRecommendationPage.bind(this),
		)
	}

	private setupMiddlewares() {}

	public getController() {
		return this.router
	}
}
