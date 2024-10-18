import { initializeAcceptButton, setButtonState } from '@/infrastructure/http/views/components/button/accept/accept'
import { acceptTerm } from '@frontend/services/api/terms'

function initializeTermsPage() {
	// @ts-expect-error - This is a global variable injected by the server
	const { saleId, nextPage } = config
	
	const acceptButton = initializeAcceptButton(async () => {

		const allCheckfields = Array.from(document.querySelectorAll('.accept-input'))

		for (const checkfield of allCheckfields) {
			const fieldID = (checkfield as HTMLInputElement).id.split('_')[1]
			
			acceptTerm(saleId, fieldID)
		}

		window.location.href = nextPage
	})

	function updateButtonState() {
		const allTermsChecked = Array.from(
			document.querySelectorAll('.accept-input')
		).every(term => (term as HTMLInputElement).checked)
		setButtonState(acceptButton, allTermsChecked)
	}

	function initializeCheckboxes(updateButtonState: () => void) {
		document.querySelectorAll('.accept-input').forEach(checkbox => {
			checkbox.addEventListener('change', () => updateButtonState())
		})
	}

	initializeCheckboxes(updateButtonState)
	updateButtonState()
}


document.addEventListener('DOMContentLoaded', initializeTermsPage)