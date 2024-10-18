export async function acceptTerm(saleId: string, fieldId: string): Promise<void> {
	const response = await fetch(`/api/v1/terms/accept/${saleId}/field/${fieldId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
  
	if (!response.ok) {
		console.error('Something went wrong', response)
		throw new Error('Failed to accept term')
	}
}