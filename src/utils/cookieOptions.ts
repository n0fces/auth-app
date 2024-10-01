import { CookieOptions } from 'express';

const isProd = Boolean(process.env.IS_PROD);

export const cookieOptions = (): Partial<CookieOptions> => ({
	httpOnly: true,
	secure: isProd, // в production режиме использовать https
	sameSite: isProd ? 'none' : undefined,
});
