import { ClientError } from 'errors/client-error';
import { NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';

export const validationResultChecker = (req: Request, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(ClientError.BadRequest('Ошибка при валидации', errors.array()));
	}
};
