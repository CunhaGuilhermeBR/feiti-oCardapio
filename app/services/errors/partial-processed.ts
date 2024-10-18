export class PartialProcessed extends Error {
	constructor() {
		super('The entity was partially processed!')
	}
}
