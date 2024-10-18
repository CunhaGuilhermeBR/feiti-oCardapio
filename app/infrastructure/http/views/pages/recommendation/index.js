/* eslint-disable no-undef */
import Swal from 'sweetalert2'

const MAX_SELECTED = 3

async function handleButtonClick(selectedCards, enrollCourses, interviewId) {
	const coursesId = Array.from(selectedCards).map(card => parseInt(card.dataset.id, 10))
  
	if (coursesId.length !== MAX_SELECTED) {
		Swal.fire({
			title: 'Atenção',
			text: `Por favor, selecione exatamente ${MAX_SELECTED} cursos.`,
			icon: 'warning',
			confirmButtonText: 'Ok',
		})
		return
	}
  
	const requestData = {
		coursesId: enrollCourses,
		interviewId,
	}
  
	try {
		const result = await Swal.fire({
			title: 'Tem certeza?',
			text: 'Deseja confirmar a matrícula nos cursos selecionados?',
			icon: 'warning',
			iconColor: '#e5493a',
			showCancelButton: true,
			confirmButtonText: 'Sim, confirmar',
			cancelButtonText: 'Não, cancelar',
			reverseButtons: true,
			customClass: {
				confirmButton: 'swal-button-confirm',
				cancelButton: 'swal-button-cancel',
			},
		})
  
		if (result.isConfirmed) {
			const response = await fetch('/api/v1/moodle/enroll', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData),
			})
  
			if (!response.ok) {
				throw new Error(`API ERROR: ${response.statusText || response.status}`)
			}
  
			await Swal.fire({
				title: 'Matricula realizada!',
				text: 'Você foi Matriculado nos cursos selecionados!',
				icon: 'success',
				iconColor: '#248290',
			})
  
			window.location.href = 'https://speckead.com.br/'
		}
	} catch (error) {
		console.error('Error sending enrollment data', error)
		Swal.fire({
			title: 'Erro',
			text: 'Ocorreu um erro ao tentar realizar a Matrícula.',
			icon: 'error',
			confirmButtonText: 'Ok',
			iconColor: '#e5493a',
		})
	}
}

async function fetchRecommendationData(interviewId) {
	try {
		const response = await fetch(`/api/v1/course/recommendationsCourses/${interviewId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
  
		if (!response.ok) {
			throw new Error(`API ERROR: ${response.statusText || response.status}`)
		}
  
		const data = await response.json()
		populateRecommendationCards(data)
	} catch (error) {
		console.error('Error fetching recommendation data', error)
	}
}

function handleCardClick(cardElement, card, selectedCards, enrollCourses, MAX_SELECTED) {
	if (!selectedCards.has(cardElement)) {
		if (selectedCards.size < MAX_SELECTED) {
			cardElement.classList.add('highlighted')
			selectedCards.add(cardElement)
			enrollCourses.push(card.moodleId)
		}
	} else {
		cardElement.classList.remove('highlighted')
		selectedCards.delete(cardElement)
		enrollCourses.splice(enrollCourses.indexOf(card.moodleId), 1)
	}
	const selectButton = document.getElementById('select-button')
	selectButton.classList.toggle('hidden', selectedCards.size !== MAX_SELECTED)
}

function populateRecommendationCards(cards, selectedCards, enrollCourses, MAX_SELECTED, starIcon, spanInfo) {
	const recommendationCardsContainer = document.getElementById('recommendation-cards-container')
	recommendationCardsContainer.innerHTML = ''
	cards.forEach((card, index) => {
		const cardElement = document.createElement('div')
		cardElement.className = 'recommendation-card'
		cardElement.dataset.id = card.id
  
		const imageUrl = card.imageUrl || '../public/assets/mockImages/abertura.png'
		const title = card.name || 'Título não disponível'
		const showStarIcon = index < 6
  
		cardElement.innerHTML = `
        ${showStarIcon
		? `
                <div class="tooltip-wrapper">
                  <img class="star-icon" src="${starIcon}" alt="Star Icon">
                  <span class="tooltip-text">${spanInfo}</span>
                </div>
              `
		: ''}
        <img src="${imageUrl}" alt="Recommendation Image">
        <div class="recommendation-card-text">
          <h3>${title}</h3>
          <p>${card.description || 'Descrição não disponível'}</p>
        </div>
      `
  
		cardElement.addEventListener('click', () => handleCardClick(cardElement, card, selectedCards, enrollCourses, MAX_SELECTED))
		recommendationCardsContainer.appendChild(cardElement)
	})
}

document.addEventListener('DOMContentLoaded', () => {

	const enrollCourses = []
	const selectedCards = new Set()

	const path = window.location.pathname
	const parts = path.split('/')
	const interviewId = parts[parts.length - 1]

	const selectButton = document.getElementById('select-button')

	selectButton.addEventListener('click', () => handleButtonClick(selectedCards, enrollCourses, interviewId))

	fetchRecommendationData(interviewId, selectedCards, enrollCourses, MAX_SELECTED, starIcon, spanInfo)
})