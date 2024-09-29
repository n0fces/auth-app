export class ServerError extends Error {
	status: number;
	errors: unknown[];

	// ! надо будет подумать над типов для errors
	constructor(status: number, message: string, name: string, errors = []) {
		// вызываем родительский конструктор у Error
		super(message);
		this.status = status;
		this.name = name;
		this.errors = errors;
	}
}
