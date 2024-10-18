/* eslint-disable no-undef */
import Swal from 'sweetalert2'

const API_URL = '/api/v1'
const SUCCESS_COPY_MESSAGE = {
	title: 'Copiado!',
	text: 'O conteúdo foi copiado para a área de transferência.',
	icon: 'success',
	timer: 1500,
	showConfirmButton: false,
}

const CONFIRM_DELETE_MESSAGE = {
	title: 'Tem certeza?',
	text: 'Você não poderá reverter essa ação!',
	icon: 'warning',
	iconColor: '#e5493a',
	showCancelButton: true,
	confirmButtonText: 'Sim, aprovar a devolutiva!',
	cancelButtonText: 'Não, cancelar!',
	reverseButtons: true,
	customClass: {
		confirmButton: 'swal-button-confirm',
		cancelButton: 'swal-button-cancel',
	},
}

const toggleClass = (element, className) => {
	element.classList.toggle(className)
}

const toggleVisibility = (elements, visible) => {
	elements.forEach((el) => {
		if (el) {
			if (visible) {
				el.classList.remove('hidden')
			} else {
				el.classList.add('hidden')
			}
		}
	})
}

const createButton = (id, text, className) => {
	const button = document.createElement('button')
	button.id = id
	button.textContent = text
	button.classList.add(className)
	return button
}

const reloadPage = () => {
	window.location.reload('/feedback')
}

const copyToClipboard = (text) => {
	const range = document.createRange()
	range.selectNode(text)
	window.getSelection().removeAllRanges()
	window.getSelection().addRange(range)
  
	return document.execCommand('copy')
}

const patchFeedbackStatus = async (saleId, title) => {
	const response = await fetch(`${API_URL}/feedback/${saleId}/${title}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ status: 'APPROVED' }),
	})
  
	if (!response.ok) {
		throw new Error(`Erro na resposta da rede: ${response.statusText}`)
	}
  
	return await response.json()
}

const patchFeedbackContent = async (feedbackIdValue, textAreaTitle, feedbackContent) => {
	const response = await fetch(`${API_URL}/feedback/${feedbackIdValue}/${textAreaTitle}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ content: feedbackContent }),
	})
  
	if (!response.ok) {
		throw new Error(`Erro na resposta da rede: ${response.statusText}`)
	}
  
	return await response.json()
}

const handleTooltipClick = (tooltipWrapper) => {
	tooltipWrapper.forEach((wrapper) => {
		wrapper.addEventListener('click', function () {
			toggleClass(this, 'active')
  
			const tooltipText = this.querySelector('.tooltip-text')
			const successful = copyToClipboard(tooltipText)
  
			successful
				? Swal.fire(SUCCESS_COPY_MESSAGE)
				: console.error('Erro ao copiar o texto')
        
			window.getSelection().removeAllRanges()
		})
	})
}

const handleDocumentClick = (event, tooltipWrapper) => {
	tooltipWrapper.forEach((wrapper) => {
		const isClickInside = wrapper.contains(event.target)
		if (!isClickInside) {
			wrapper.classList.remove('active')
		}
	})
}

const handleEditIconClick = (editIcons) => {
	editIcons.forEach((editIcon) => {
		editIcon.addEventListener('click', () => {
			const feedbackContainer = editIcon.closest('.feedback-textArea')
			editFeedbackArea(feedbackContainer, editIcon)
		})
	})
}

const handleOkIconClick = (okIcons) => {
	okIcons.forEach((okIcon) => {
		okIcon.addEventListener('click', async function () {
			const result = await Swal.fire(CONFIRM_DELETE_MESSAGE)

			if (result.isConfirmed) {
				await Swal.fire({
					title: 'Devolutiva Aprovada!',
					text: 'A sua devolutiva foi aprovada com sucesso.',
					icon: 'success',
					iconColor: '#248290',
				})

				const feedbackContainer = okIcon.closest('.feedback-textArea')
				const feedbackIdElement = feedbackContainer.querySelector('.feedbackId')
				const textAreaTitle = feedbackContainer.querySelector('.textAreaTitle')
				const saleId = feedbackIdElement.getAttribute('data-tooltip').trim()
				const title = textAreaTitle.textContent.trim()

				try {
					await patchFeedbackStatus(saleId, title)
					reloadPage()
				} catch (error) {
					console.error('Erro ao aprovar feedback:', error)
				}
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				await Swal.fire({
					title: 'Ação cancelada!',
					text: 'A sua devolutiva não foi aprovada.',
					icon: 'error',
					iconColor: '#e5493a',
				})
			}
		})
	})
}

const editFeedbackArea = (feedbackContainer, editIcon) => {
	const okIcon = feedbackContainer.querySelector('.okIcon')
	const textAreaTitle = feedbackContainer.querySelector('.textAreaTitle')
	const textAreaBody = feedbackContainer.querySelector('.textAreaBody')
	// const feedbackDate = feedbackContainer.querySelector('.feedbackDate')
	const feedbackIdElement = feedbackContainer.querySelector('.feedbackId')
	const feedbackIconsArea = feedbackContainer.querySelector('.feedback-icons-area')
	const originalText = textAreaBody.dataset.body
	const feedbackIdValue = feedbackIdElement.getAttribute('data-tooltip')

	const textarea = document.createElement('textarea')
	textarea.value = originalText
	textarea.className = 'textareaBodyClass'
	textAreaBody.replaceWith(textarea)

	const buttonContainer = document.createElement('div')
	buttonContainer.className = 'button-container'

	const saveButton = createButton('saveButton', 'Salvar', 'saveButtonClass')
	const backButton = createButton('backButton', 'Sair', 'backButtonClass')

	buttonContainer.appendChild(saveButton)
	buttonContainer.appendChild(backButton)
	feedbackContainer.insertBefore(buttonContainer, textarea.nextSibling)

	feedbackIconsArea.classList.add('hidden-in-edit-mode')
	feedbackContainer.classList.add('edit-mode')
	toggleVisibility([editIcon, okIcon, feedbackIdElement], false)
	hideOtherFeedbackAreas()

	backButton.addEventListener('click', reloadPage)
	saveButton.addEventListener('click', () => saveAndExitFeedbackArea(feedbackContainer, textarea, textAreaBody, textAreaTitle, feedbackIdValue))
}

const hideOtherFeedbackAreas = () => {
	const allFeedbackAreas = document.querySelectorAll('.feedback-textArea')
	allFeedbackAreas.forEach((area) => {
		if (!area.classList.contains('edit-mode')) {
			area.classList.add('hidden')
		}
	})
}

const saveAndExitFeedbackArea = async (_feedbackContainer, textarea, textAreaBody, textAreaTitle, feedbackIdValue) => {
	if (!textarea || !textAreaBody || !textAreaTitle || !feedbackIdValue) {
		console.error('Um ou mais argumentos são inválidos:', { textarea, textAreaBody, feedbackIdValue })
		return
	}

	const feedbackContent = textarea.value
	const textAreaTitleValue = textAreaTitle.textContent.trim()

	textAreaBody.textContent = feedbackContent

	try {
		await patchFeedbackContent(feedbackIdValue, textAreaTitleValue, feedbackContent)
		reloadPage()
	} catch (error) {
		console.error('Erro ao salvar feedback:', error)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const tooltipWrapper = document.querySelectorAll('.tooltip-wrapper')
	const editIcons = document.querySelectorAll('.editIcon')
	const okIcons = document.querySelectorAll('.okIcon')
  
	handleTooltipClick(tooltipWrapper)
  
	document.addEventListener('click', (event) => handleDocumentClick(event, tooltipWrapper))
  
	handleEditIconClick(editIcons)
	handleOkIconClick(okIcons)
})