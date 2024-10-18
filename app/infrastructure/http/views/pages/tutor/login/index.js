/* eslint-disable no-undef */
import Swal from 'sweetalert2'

document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('loginForm')

	async function handleLogin(event) {
		event.preventDefault()

		const email = document.getElementById('email').value
		const password = document.getElementById('password').value

		try {
			const response = await fetch('/moodle/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			})

			const data = await response.json()

			if (response.ok) {
				await Swal.fire({
					title: 'Login bem-sucedido!',
					icon: 'success',
					confirmButtonText: 'OK',
					confirmButtonColor: '#248290',
				})
				window.location.href = '/feedback/pending'
			} else {
				throw new Error(
					data.message || 
                    'Credenciais inválidas'
				)
			}
		} catch (error) {
			console.error('Erro no login:', error.message || error)
			Swal.fire({
				title: 'Falha no Login',
				text: 'Verifique suas credenciais e tente novamente.',
				icon: 'error',
				confirmButtonColor: '#248290',
				confirmButtonText: 'OK',
			})
		}
	}

	loginForm.addEventListener('submit', handleLogin)
})