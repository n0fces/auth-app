import { NextFunction, Response } from 'express';
import { tokenModel } from 'jwt/models/token-model';
import { userModel } from 'jwt/models/user-model';
import { AppRequest } from 'types';
import { cookieOptions } from 'utils/cookieOptions';
import { isString } from 'utils/isString';
import { setCookieTokens } from 'utils/setCookie';
import { validationResultChecker } from 'utils/validationResultChecker';

class UserController {
	async registration(req: AppRequest, res: Response, next: NextFunction) {
		try {
			validationResultChecker(req, next);
			const { email, password } = req.body;
			if (isString(email) && isString(password)) {
				await userModel.registration(email, password);
			}

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}

	async activate(req: AppRequest, res: Response, next: NextFunction) {
		const activationToken = req.params.link;
		try {
			if (isString(activationToken)) {
				const userAgent = req.headers['user-agent'];
				const { accessToken, refreshToken } = await userModel.activate(
					activationToken,
					userAgent,
				);

				setCookieTokens({ res, accessToken, refreshToken });

				res.redirect(process.env.CLIENT_URL);
			}
		} catch (error) {
			next(error);
		}
	}

	async resendActivationLink(
		req: AppRequest,
		res: Response,
		next: NextFunction,
	) {
		const email = req.body.email;
		try {
			if (isString(email)) {
				await userModel.resendActivationLink(email);
			}

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}

	async login(req: AppRequest, res: Response, next: NextFunction) {
		try {
			validationResultChecker(req, next);
			const { email, password } = req.body;
			const userAgent = req.headers['user-agent'];
			if (isString(email) && isString(password)) {
				const { accessToken, refreshToken } = await userModel.login(
					email,
					password,
					userAgent,
				);
				setCookieTokens({ res, accessToken, refreshToken });

				return res.send({ email });
			}
		} catch (error) {
			next(error);
		}
	}

	async logout(req: AppRequest, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			if (isString(refreshToken)) {
				await userModel.logout(refreshToken);

				// в куках хранится refresh и access токены
				res.clearCookie('refreshToken', cookieOptions());
				res.clearCookie('accessToken', cookieOptions());

				res.sendStatus(200);
			}
		} catch (error) {
			next(error);
		}
	}

	async forgotPassword(req: AppRequest, res: Response, next: NextFunction) {
		try {
			validationResultChecker(req, next);
			const { email } = req.body;
			if (isString(email)) {
				await userModel.forgotPassword(email);
			}

			res.sendStatus(200);
		} catch (error) {
			next(error);
		}
	}

	async resendForgotPasswords(
		req: AppRequest,
		res: Response,
		next: NextFunction,
	) {
		try {
			const { token } = req.body;
			if (isString(token)) {
				const { email } = tokenModel.decodeResetToken(token);
				await userModel.forgotPassword(email);

				res.sendStatus(200);
			}
		} catch (error) {
			next(error);
		}
	}

	resetPasswordAccess(req: AppRequest, res: Response, next: NextFunction) {
		const resetToken = req.params.token;
		try {
			if (isString(resetToken)) {
				tokenModel.verifyResetToken(resetToken);
				res.redirect(`${process.env.CLIENT_URL}/reset-password/${resetToken}`);
			}
		} catch (error) {
			next(error);
		}
	}

	async resetPassword(req: AppRequest, res: Response, next: NextFunction) {
		try {
			validationResultChecker(req, next);
			const {
				password,
				// logoutAllDevices,
				token: resetToken,
			} = req.body;
			const email =
				isString(resetToken) && tokenModel.verifyResetToken(resetToken).email;

			if (isString(email) && isString(password)) {
				await userModel.resetPassword(email, password);

				// if (logoutAllDevices) {
				// 	userModel.logoutAllDevices(email).catch((err: unknown) => {
				// 		throw err;
				// 	});
				// }

				res.sendStatus(200);
			}
		} catch (error) {
			next(error);
		}
	}

	async refresh(req: AppRequest, res: Response, next: NextFunction) {
		try {
			const { refreshToken: refresh } = req.cookies;
			const userAgent = req.headers['user-agent'];
			if (isString(refresh)) {
				const { accessToken, refreshToken } = await userModel.updateRefresh(
					refresh,
					userAgent,
				);
				setCookieTokens({ res, accessToken, refreshToken });

				res.sendStatus(200);
			}
		} catch (error) {
			next(error);
		}
	}

	access(req: AppRequest, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			if (isString(refreshToken)) {
				const accessToken = userModel.updateAccess(refreshToken);

				setCookieTokens({ res, accessToken });

				res.sendStatus(200);
			}
		} catch (error) {
			next(error);
		}
	}

	async getUser(req: AppRequest, res: Response, next: NextFunction) {
		try {
			const user_id = req.user_id;
			if (user_id) {
				const user = await userModel.getUser(user_id);

				res.send(user);
			}
		} catch (error) {
			next(error);
		}
	}

	checkAccess(req: AppRequest, res: Response) {
		res.sendStatus(200);
	}
}

export const userController = new UserController();
