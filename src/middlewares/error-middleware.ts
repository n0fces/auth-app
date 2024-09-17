import { ClientError } from 'errors/client-error';
import { ServerError } from 'errors/server-error';
import { NextFunction, Request, Response } from 'express';

export function errorMiddleware(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	// будет логировать ошибку
	console.log(err);
	// * если предусмотренная нами клиентская ошибка или серверная ошибка, то отправляем её. На фронтенде
	// * мы знаем, как ее обрабатывать
	if (err instanceof ClientError || err instanceof ServerError) {
		return res
			.status(err.status)
			.json({ message: err.message, errors: err.errors, name: err.name });
	}
	// если не предусмотрели ошибку, то это наша проблема (проблема сервера)
	return res.status(500).json({ message: 'Непредвиденная ошибка' });
}
