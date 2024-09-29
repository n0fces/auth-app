export class ClientError extends Error {
	status: number;
	errors: unknown[];

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

	static BadRequest(message: string, errors = []) {
		return new ClientError(400, message, 'BadRequest', errors);
	}

	static UnauthorizedError() {
		return new ClientError(
			401,
			'Вы не авторизованы для доступа к этому ресурсу',
			'UnauthorizedError',
		);
	}

	static WrongPassword() {
		return new ClientError(
			401,
			'Неправильный пароль. Пожалуйста, попробуйте еще раз',
			'WrongPassword',
		);
	}

	static AccessTokenExpired() {
		return new ClientError(401, 'Токен доступа истек', 'AccessTokenExpired');
	}

	static AccessTokenInvalid() {
		return new ClientError(
			401,
			'Не валидный токен доступа',
			'AccessTokenInvalid',
		);
	}

	static RefreshTokenExpired() {
		return new ClientError(401, 'Refresh токен истек', 'RefreshTokenExpired');
	}

	static RefreshTokenInvalid() {
		return new ClientError(
			401,
			'Не валидный refresh токен',
			'RefreshTokenInvalid',
		);
	}

	static ForbiddenError() {
		return new ClientError(
			403,
			'Неправильная сессия или скомпроментированный рефреш токен',
			'ForbiddenError',
		);
	}

	static UserNotFound() {
		return new ClientError(
			404,
			'Учетная запись не найдена. Пожалуйста, проверьте введенные данные или зарегистрируйтесь',
			'UserNotFound',
		);
	}

	static UserAlreadyExisted() {
		return new ClientError(
			409,
			'Вы уже зарегистрированы. Пожалуйста, войдите в свою учетную запись',
			'UserAlreadyExisted',
		);
	}

	static ActivationLinkExpired() {
		return new ClientError(
			410,
			'Ссылка для активации устарела. Пожалуйста, активируйте аккаунт по последней ссылке активации',
			'ActivationLinkExpired',
		);
	}

	static ResetLinkExpired() {
		return new ClientError(
			410,
			'Ссылка для сброса пароля устарела. Попробуйте еще раз обновить пароль',
			'ResetLinkExpired',
		);
	}
}
