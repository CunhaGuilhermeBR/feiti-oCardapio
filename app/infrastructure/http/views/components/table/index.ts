/* eslint-disable @typescript-eslint/no-explicit-any */

function startTableComponent() {
	const modalFieldsContainer = document.querySelector('.modal-fields') as HTMLElement
	const editForm = document.getElementById('editForm') as HTMLFormElement
	const saveButton = editForm.querySelector('button') as HTMLButtonElement

	function createInput(name: string, value: any) {
		const formattedName = name.charAt(0).toUpperCase() + name.slice(1)
		const label = document.createElement('label')
		label.htmlFor = name
		label.textContent = translateInputValue(formattedName)
		label.classList.add('input-admin-label')

		const input = document.createElement('input')
		input.type = 'text'
		input.name = name
		input.value = value
		input.placeholder = formattedName
		input.classList.add('input-admin')

		const container = document.createElement('div')
		container.appendChild(label)
		container.appendChild(input)

		return container
	}

	document.querySelectorAll('.edit-link').forEach((link) => {
		link.addEventListener('click', (event) => {
			event.preventDefault()
			modalFieldsContainer.innerHTML = ''

			const fields = JSON.parse(link.getAttribute('data-fields') || '{}')
			const appId = link.getAttribute('data-id')
			const entity = link.getAttribute('data-entity')

			Object.entries(fields).forEach(([name, value]) => {
				modalFieldsContainer.appendChild(createInput(name, value))
			})

			if (!appId || !entity) {
				console.error('App ID or entity not found')
				return
			}
			editForm.action = `/api/v1/${entity}/${appId}`

			const editModal = document.getElementById('editModal')
			if (!editModal) {
				console.error('Edit modal not found')
				return
			}
			editModal.style.display = 'flex'
		})
	})

	document.querySelectorAll('.delete-link').forEach((link) => {
		link.addEventListener('click', async (event) => {
			event.preventDefault()
			modalFieldsContainer.innerHTML = ''

			const appId = link.getAttribute('data-id')
			const entity = link.getAttribute('data-entity')

			if (!appId || !entity) {
				console.error(`App ID ${appId} or entity ${entity} not found`)
				return
			}
			editForm.action = `/api/v1/${entity}/${appId}`
			if(confirm('Você tem certeza que deseja prosseguir com essa ação? Essa ação é irreversível!')){
				const response = await fetch(editForm.action, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					}
				})
	
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				alert(`${entity} apagado(a) com sucesso!`)
			}
		})
	})

	saveButton.addEventListener('click', async function () {
		const formData = new FormData(editForm)

		const dataObject: { [key: string]: string } = {}
		for (const [key, value] of formData.entries()) {
			dataObject[key] = String(value)
		}

		try {
			const response = await fetch(editForm.action, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(dataObject),
			})

			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			const editModal = document.getElementById('editModal')
			if (!editModal) {
				console.error('Edit modal not found')
				return
			}
			editModal.style.display = 'none'
		} catch (error) {
			console.error('Network response was not ok', error)
		}
	})

	const closeButton = document.querySelector('.close-button')
	if (!closeButton) {
		console.error('Close button not found')
		return
	}
	closeButton.addEventListener('click', function () {
		const editModal = document.getElementById('editModal')
		if (!editModal) {
			console.error('Edit modal not found')
			return
		}
		editModal.style.display = 'none'
	})

	window.addEventListener('click', function (event) {
		const editModal = document.getElementById('editModal')
		if (editModal && event.target === editModal) {
			editModal.style.display = 'none'
		}
	})
}

document.addEventListener('DOMContentLoaded', startTableComponent)
function translateInputValue(formattedName: string): string {
	const translations: { [key: string]: string } = {
		'Name': 'Nome',
		'ImageUrl': 'Imagem',
		'Url': 'Url'
	}

	return translations[formattedName] || 'Campo'
}


