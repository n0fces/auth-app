import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { userModel } from 'jwt/models/user-model';
import { setCookie } from 'utils/setCookie';
import { validationResultChecker } from 'utils/validationResultChecker';

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
			const userAgent = req.headers['user-agent'];
			const { accessToken, refreshToken } = await userModel.login(
				email,
				password,
				userAgent,
			);

			setCookie({ res, accessToken, refreshToken });

			return res.redirect(process.env.CLIENT_URL as string);
		} catch (error) {
			next(error);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.signedCookies;
			await userModel.logout(refreshToken);
			// * Я ведь храню в куках не только refreshToken, но и accessToken
			res.clearCookie('refreshToken');
			res.clearCookie('accessToken');
			return res.redirect(process.env.CLIENT_URL as string);
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
			const { refreshToken: refresh } = req.signedCookies;
			const accessToken = await userModel.updateAccess(refresh);

			setCookie({ res, accessToken });

			// * пока на шару поставил такой ответ от сервера
			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}

	// * здесь нужно иметь в виду, что это роут для обновления рефреш токена
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken: refresh } = req.signedCookies;
			const userAgent = req.headers['user-agent'];
			const { accessToken, refreshToken } = await userModel.updateRefresh(
				refresh,
				userAgent,
			);

			setCookie({ res, accessToken, refreshToken });

			// * пока на шару поставил такой ответ от сервера
			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}
}

export const userController = new UserController();
