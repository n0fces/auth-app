export class ServerError extends Error {
	status: number;
	errors: any[];

	// ! надо будет подумать над типов для errors
	constructor(
		status: number,
		message: string,
		name: string,
		errors: unknown[] = [],
	) {
		// вызываем родительский конструктор у Error
		super(message);
		this.status = status;
		this.name = name;
		this.errors = errors;
	}
}
