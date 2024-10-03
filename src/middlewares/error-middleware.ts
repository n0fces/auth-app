import { ClientError } from 'errors/client-error';
import { ServerError } from 'errors/server-error';
import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
	err: Error,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Middleware для ошибок всегда принимает 4 параметра: err, req, res, и next. Подробнее: https://expressjs.com/en/guide/error-handling.html
	next: NextFunction,
) {
	// логирование ошибки
	console.error(err);

	if (err instanceof ClientError || err instanceof ServerError) {
		return res
			.status(err.status)
			.json({ message: err.message, errors: err.errors, name: err.name });
	}
	// не предусмотренная сервером ошибка
	return res.status(500).json({ message: 'Непредвиденная ошибка' });
}
