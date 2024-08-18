import 'dotenv/config';
import { NextFunction, Request, Response } from 'express';
import { userModel } from 'jwt/models/user-model';

class UserController {
	async registration(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			await userModel.registration(email, password);

			res.sendStatus(200);
		} catch (error) {
			console.log(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const { accessToken, refreshToken } = await userModel.login(
				email,
				password,
			);

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

			return res.redirect(process.env.CLIENT_URL as string);
		} catch (error) {}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
		} catch (error) {}
	}

	async activate(req: Request, res: Response, next: NextFunction) {
		const activationLink = req.params.link;
		try {
			await userModel.activate(activationLink);

			return res.redirect(`${process.env.CLIENT_URL}/login`);
		} catch (error) {
			// ! здесь надо обработать разные ошибки
			// 1) ссылка активации устарела
			// делать редирект на страницу с кнопкой, при нажатии на которую на почту будет отправлено повторное письмо с ссылкой активации
			// return res.redirect(`${process.env.CLIENT_URL}/resend-activation-link/${activationLink}`);
			// 2) ссылка активации недействительна
			// редирект на главную страницу приложения
			// return res.redirect(`${process.env.CLIENT_URL}`);
		}
	}

	async resendActivationLink(req: Request, res: Response, next: NextFunction) {
		const activationLink = req.params.link;
		try {
			await userModel.resendActivationLink(activationLink);
			// редирект на страницу с уведомлением о том, что ссылка активации была отправлена повторно
			// либо потом можно как-то иначе это указывать
			return res.redirect(
				`${process.env.CLIENT_URL}/resend-activation-link-sent`,
			);
		} catch (error) {
			console.log(error);
		}
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
