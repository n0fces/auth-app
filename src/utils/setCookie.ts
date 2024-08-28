import { Response } from 'express';

interface setCookieTokensProps {
	res: Response;
	accessToken?: string;
	refreshToken?: string;
}

export const setCookieTokens = ({
	res,
	accessToken,
	refreshToken,
}: setCookieTokensProps) => {
	// если используем https, то можно также добавить опцию secure
	// ! возможно придется еще ставить опцию samesite для обеспечения безопасности от межсайтовых атак
	// ! опция path
	if (refreshToken) {
		res.cookie('refreshToken', refreshToken, {
			maxAge: Number(process.env.REFRESH_TOKEN_LIFE),
			httpOnly: true,
		});
	}
	if (accessToken) {
		res.cookie('accessToken', accessToken, {
			maxAge: Number(process.env.ACCESS_TOKEN_LIFE),
			httpOnly: true,
		});
	}
};
