import { ClientError } from 'errors/client-error';
import { NextFunction, Request, Response } from 'express';
import { tokenModel } from 'jwt/models/token-model';

// ! здесь надо подумать насчет используемой ошибки
export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const cookies = req.cookies;
		const { accessToken, refreshToken } = cookies;
		// если рефреш токена совсем нет, то это означает, что либо пользователь
		// первый раз зашел в приложение, либо он давно не заходил, поэтому
		// у него истек и рефреш токен
		if (!refreshToken) {
			return next(ClientError.UnauthorizedError());
		}

		if (!accessToken) {
			return next(ClientError.AccessTokenExpired());
		}

		const userData = tokenModel.verifyAccessToken(accessToken);

		req.user_id = userData.sub;

		next();
	} catch (error) {
		return next(ClientError.UnauthorizedError());
	}
}
