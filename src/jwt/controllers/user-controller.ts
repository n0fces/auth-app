import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { userModel } from 'jwt/models/user-model';
import { setCookieTokens } from 'utils/setCookie';
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

	async activate(req: Request, res: Response, next: NextFunction) {
		const activationToken = req.params.link;
		try {
			const userAgent = req.headers['user-agent'];
			const { accessToken, refreshToken } = await userModel.activate(
				activationToken,
				userAgent,
			);

			setCookieTokens({ res, accessToken, refreshToken });

			return res.redirect(`${process.env.CLIENT_URL}`);
		} catch (error) {
			next(error);
		}
	}

	async resendActivationLink(req: Request, res: Response, next: NextFunction) {
		const email = req.body.email;
		try {
			await userModel.resendActivationLink(email);

			// * когда клиент получит 200 статус код, то на этой же странице напишем
			// * одну строчку, что ссылка на активацию была отправлена
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

			setCookieTokens({ res, accessToken, refreshToken });

			return res.redirect(`${process.env.CLIENT_URL}`);
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

	// * для обновления refresh токена
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken: refresh } = req.signedCookies;
			const userAgent = req.headers['user-agent'];
			const { accessToken, refreshToken } = await userModel.updateRefresh(
				refresh,
				userAgent,
			);

			setCookieTokens({ res, accessToken, refreshToken });

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}

	// * для обновления access токена
	async access(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken: refresh } = req.signedCookies;
			const accessToken = await userModel.updateAccess(refresh);

			setCookieTokens({ res, accessToken });

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}
}

export const userController = new UserController();
