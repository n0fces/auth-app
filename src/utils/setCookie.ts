import { Response } from 'express';
import { cookieOptions } from './cookieOptions';

interface setCookieTokensProps {
	res: Response;
	accessToken?: string;
	refreshToken?: string;
}

/**
 * Функция по установке refreshToken и accessToken в cookies пользователя
 * @param {setCookieTokensProps} - Принимает объект аргументов, необходимых для установления токенов.
 * Устанавливает те токены, которые были переданы
 */
export const setCookieTokens = ({
	res,
	accessToken,
	refreshToken,
}: setCookieTokensProps) => {
	if (refreshToken) {
		res.cookie('refreshToken', refreshToken, {
			maxAge: Number(process.env.REFRESH_TOKEN_LIFE),
			...cookieOptions(),
		});
	}
	if (accessToken) {
		res.cookie('accessToken', accessToken, {
			maxAge: Number(process.env.ACCESS_TOKEN_LIFE),
			...cookieOptions(),
		});
	}
};
