import { Response } from 'express';

export const setCookie = (
	res: Response,
	accessToken: string,
	refreshToken: string,
) => {
	// если используем https, то можно также добавить опцию secure
	// ! возможно придется еще ставить опцию samesite для обеспечения безопасности от межсайтовых атак
	// ! опция path
	res.cookie('refreshToken', refreshToken, {
		maxAge: Number(process.env.REFRESH_TOKEN_LIFE),
		httpOnly: true,
	});
	res.cookie('accessToken', accessToken, {
		maxAge: Number(process.env.ACCESS_TOKEN_LIFE),
		httpOnly: true,
	});
};
