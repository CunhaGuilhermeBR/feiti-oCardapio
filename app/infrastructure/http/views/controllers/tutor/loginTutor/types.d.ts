interface Textfield {
	label: string
	placeholder: string
}

export interface LoginTutorPageData {
	title: string
	logoUrl: string
	formTitle: string
	buttonText: string
	configFormFields: {
		emailField: Textfield
		passwordField: Textfield
	}
	url: string
}