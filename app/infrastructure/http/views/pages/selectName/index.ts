import { changeUserName } from '@frontend/services/api/authenticate/changeUserName'

function initializeSelectNamePage() {
	const nextButton = document.querySelector<HTMLButtonElement>('a.btn')
	const interviewNameInput = document.getElementById('interviewName') as HTMLInputElement | null

	if (!nextButton) {
		console.error('Next button not found')
		return
	}

	if (!interviewNameInput) {
		console.error('Interview name input not found')
		return
	}

	const handleNextButtonClick = async (event: MouseEvent) => {
		event.preventDefault()

		const interviewName = interviewNameInput.value.trim()
		
		if (!interviewName) {
			console.error('Interview name is empty')
			return
		}

		try {
			await changeUserName(interviewName)
			const nextHref = nextButton.getAttribute('href')
			if (nextHref) {
				window.location.href = nextHref
			} else {
				console.error('Next button href attribute is missing')
				window.location.href = '/error'
			}
		} catch (error) {
			console.error('Error during the fetch operation:', error)
			window.location.href = '/error'
		}
	}

	nextButton.addEventListener('click', handleNextButtonClick)
}

document.addEventListener('DOMContentLoaded', initializeSelectNamePage)