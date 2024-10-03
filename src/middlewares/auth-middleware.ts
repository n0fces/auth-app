/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { ClientError } from 'errors/client-error';
import { NextFunction, Request, Response } from 'express';
import { tokenModel } from 'jwt/models/token-model';
import { isString } from 'utils/isString';

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

		// если токен не пришел, значит он истек
		if (!accessToken || !isString(accessToken)) {
			return next(ClientError.AccessTokenExpired());
		}

		// верификация токена
		const userData = tokenModel.verifyAccessToken(accessToken);

		req.user_id = userData.sub;

		next();
	} catch {
		return next(ClientError.UnauthorizedError());
	}
}
