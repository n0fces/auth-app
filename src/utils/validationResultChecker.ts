import { ClientError } from 'errors/client-error';
import { NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppRequest } from 'types';

/**
 * Функция проверяет, были ли обнаружены какие-то ошибки в результате валидации.
 * Если ошибка была найдена, то она далее передается для обработки в error-middleware
 * @param {AppRequest} req - Объект запроса, который проверяется на наличие ошибок при валидации
 * @param {NextFunction} next - Функция обратного вызова, которая используется
 * для передачи управления следующей функции промежуточного программного обеспечения в стеке
 */
export const validationResultChecker = (
	req: AppRequest,
	next: NextFunction,
) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(ClientError.BadRequest('Ошибка при валидации', errors.array()));
	}
};
