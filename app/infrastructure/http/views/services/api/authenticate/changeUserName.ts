export async function changeUserName(interviewName: string): Promise<boolean> {
	const response = await fetch('/api/v1/authenticate/changeUserName', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ interviewName }),
	})
  
	if (!response.ok) {
		console.error('Something went wrong', response)
		throw new Error('Failed to change user name')
	}
  
	return true
}