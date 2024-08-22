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
		// к запросу прицепить токен мы можем при помощи заголовков
		// токен обычно указывает в заголовке authorization
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return next(ClientError.UnauthorizedError());
		}
		// первым словом будет Bearer
		const accessToken = authorizationHeader.split(' ')[1];
		if (!accessToken) {
			return next(ClientError.UnauthorizedError());
		}
		// валидируем аксесс токен
		const userData = tokenModel.verifyAccessToken(accessToken);
		if (!userData) {
			return next(ClientError.UnauthorizedError());
		}

		next();
	} catch (error) {
		return next(ClientError.UnauthorizedError());
	}
}
