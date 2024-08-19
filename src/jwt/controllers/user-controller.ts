import 'dotenv/config';
import { ClientError } from 'errors/client-error';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { userModel } from 'jwt/models/user-model';

const validationResultChecker = (req: Request, next: NextFunction) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next(ClientError.BadRequest('Ошибка при валидации', errors.array()));
	}
};

class UserController {
	async registration(req: Request, res: Response, next: NextFunction) {
		try {
			validationResultChecker(req, next);
			const { email, password } = req.body;
			await userModel.registration(email, password);

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			validationResultChecker(req, next);
			const { email, password } = req.body;
			const { accessToken, refreshToken } = await userModel.login(
				email,
				password,
			);

			// если используем https, то можно также добавить опцию secure
			// ! возможно придется еще ставить опцию samesite для обеспечения безопасности от межсайтовых атак
			// ! опция path
			res.cookie('refreshToken', refreshToken, {
				maxAge: Number(process.env.REFRESH_TOKEN_LIFE),
				httpOnly: true,
			});
			res.cookie('accessToken', accessToken, {
				maxAge: Number(process.env.ACCESS_TOKEN_LIFE),
				httpOnly: true,
			});

			return res.redirect(process.env.CLIENT_URL as string);
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {
			next(error);
		}
	}

	async activate(req: Request, res: Response, next: NextFunction) {
		const activationLink = req.params.link;
		try {
			await userModel.activate(activationLink);

			return res.redirect(`${process.env.CLIENT_URL}/login`);
		} catch (error) {
			next(error);
		}
	}

	async resendActivationLink(req: Request, res: Response, next: NextFunction) {
		const activationLink = req.params.link;
		try {
			await userModel.resendActivationLink(activationLink);
			// редирект на страницу с уведомлением о том, что ссылка активации была отправлена повторно
			// либо потом можно как-то иначе это указывать
			return res.redirect(
				`${process.env.CLIENT_URL}/resend-activation-link-sent`,
			);
		} catch (error) {
			next(error);
		}
	}

	// * для обновления access токена
	async access(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {
			next(error);
		}
	}

	// * здесь нужно иметь в виду, что это роут для обновления рефреш токена
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {
			next(error);
		}
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			res.json(['123', '456']);
		} catch (error) {
			next(error);
		}
	}
}

export const userController = new UserController();
