import { CookieOptions } from 'express';

const isProd = Boolean(process.env.IS_PROD);

/**
 * Использование данной функции обусловлено тем, что удаление куков должно
 * сопровождаться описанием точно таких же опций, которые были при их установке
 * Подробнее здесь: https://expressjs.com/en/api.html#res.clearCookie
 */
export const cookieOptions = (): Partial<CookieOptions> => ({
	httpOnly: true,
	secure: isProd, // в production режиме использовать https
	sameSite: isProd ? 'none' : undefined,
});
