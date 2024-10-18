import { Application } from 'express'
import Services from '@/services'
import { TutorController } from '../tutor/loginTutor'


class MakeTutorController {
	private constructor()  {}
    
	public static execute(application: Application): TutorController {
		return TutorController.getInstance(
			application,
			Services.Tutor,
			Services.ConfigurableItem
		)
	}
}

export default MakeTutorController