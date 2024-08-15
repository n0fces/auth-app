import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { userModel } from 'jwt/models/user-model';

class UserController {
	async registration(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const { accessToken, refreshToken, caption } =
				await userModel.registration(email, password);

			// если используем https, то можно также добавить опцию secure
			// ! возможно придется еще ставить опцию samesite для обеспечения безопасности от межсайтовых атак
			res.cookie('refreshToken', refreshToken, {
				maxAge: Number(process.env.REFRESH_TOKEN_LIFE),
				httpOnly: true,
			});
			res.cookie('accessToken', accessToken, {
				maxAge: Number(process.env.ACCESS_TOKEN_LIFE),
				httpOnly: true,
			});

			res.sendStatus(200);
		} catch (error) {
			console.log(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}

	async activate(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			res.json(['123', '456']);
		} catch (error) {}
	}
}

export const userController = new UserController();
