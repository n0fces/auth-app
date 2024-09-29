import { ClientError } from 'errors/client-error';
import { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppRequest } from 'types';

export const validationResultChecker = (
	req: AppRequest,
	next: NextFunction,
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(ClientError.BadRequest('Ошибка при валидации', errors.array()));
	}
};
