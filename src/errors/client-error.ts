// ! ВСЕ ЭТИ ОШИБКИ НЕОБХОДИМО ПРАВИЛЬНО ОБРАБАТЫВАТЬ НА КЛИЕНТЕ!
export class ClientError extends Error {
	status: number;
	errors: any[];

	// ! надо будет подумать над типов для errors
	constructor(status: number, message: string, errors: any[] = []) {
		// вызываем родительский конструктор у Error
		super(message);
		this.status = status;
		this.errors = errors;
	}

	// ? надо будет потом посмотреть код ошибок и их описание
	static UnauthorizedError() {
		return new ClientError(
			401,
			'Вы не авторизованы для доступа к этому ресурсу',
		);
	}

	static UserAlreadyExisted() {
		return new ClientError(
			409,
			'Вы уже зарегистрированы. Пожалуйста, войдите в свою учетную запись',
		);
	}

	static ActivationLinkExpiredError() {
		return new ClientError(
			410,
			'Ссылка для активации устарела. Пожалуйста, активируйте аккаунт по последней ссылке активации',
		);
	}

	static WrongPassword() {
		return new ClientError(
			401,
			'Неправильный пароль. Пожалуйста, попробуйте еще раз',
		);
	}

	static UserNotFound() {
		return new ClientError(
			404,
			'Учетная запись не найдена. Пожалуйста, проверьте введенные данные или зарегистрируйтесь',
		);
	}

	static ForbiddenError() {
		return new ClientError(
			403,
			'Неправильная сессия или скомпроментированный рефреш токен',
		);
	}

	static BadRequest(message: string, errors: any[] = []) {
		return new ClientError(400, message, errors);
	}
}
