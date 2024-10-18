export function initializeAcceptButton(handleClick: () => void) {
	const acceptButton = document.getElementById('acceptButton') as HTMLButtonElement | null
  
	if (!acceptButton) {
		throw new Error('Accept button not found')
	}
  
	acceptButton.addEventListener('click', handleClick)
	return acceptButton
}
  
export function setButtonState(button: HTMLButtonElement | null, isEnabled: boolean) {
	if (!button) {
		throw new Error('Button not found')
	}
    
	button.disabled = !isEnabled
	button.classList.toggle('btn-disabled', !isEnabled)
}