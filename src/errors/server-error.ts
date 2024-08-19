export class ServerError extends Error {
	status: number;
	errors: any[];

	// ! надо будет подумать над типов для errors
	constructor(status: number, message: string, errors: any[] = []) {
		// вызываем родительский конструктор у Error
		super(message);
		this.status = status;
		this.errors = errors;
	}
}
