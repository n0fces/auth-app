import { pendingUsersAPI, tokenAPI, userAPI } from 'api';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { ClientError } from 'errors/client-error';
import { PendingUser } from 'types';
import { mailModel } from './mail-model';
import { tokenModel } from './token-model';

class UserModel {
	async registration(email: string, password: string) {
		// Проверка того, что пользователь уже существует
		const candidate = await userAPI.getUserByEmail(email);
		if (candidate) {
			throw ClientError.handleUserAlreadyRegistered();
		}

		// Проверка того, что пользователь первый раз проходит регистрацию
		// или пользователь когда-то давно пытался пройти регистрацию, но его уже очистило
		// из таблицы pending_users
		const candidatePendingUser =
			await pendingUsersAPI.getPendingUserByEmail(email);

		let activationLink: string;
		if (candidatePendingUser) {
			// пользователь уже есть в таблице pending_users, поэтому просто изменим токен активации и отдадим его
			activationLink = await pendingUsersAPI.updatePendingUserToken(email);
		} else {
			// Пользователь первый раз проходит регистрацию, поэтому создаем его в таблице pending_users
			const hashedPassword = await bcrypt.hash(password, 10);
			activationLink = await pendingUsersAPI.createPendingUser(
				email,
				hashedPassword,
			);
		}

		// отправляем письмо с ссылкой активации на указанную почту
		await mailModel.sendActivationMail(
			email,
			`${process.env.SERVER_URL}/api/activate/${activationLink}`,
		);
	}

	async activate(activationLink: string) {
		const pendingUser =
			await pendingUsersAPI.getPendingUserByToken(activationLink);

		if (pendingUser) {
			const { email, password, token_expiration } = pendingUser;

			if (token_expiration >= new Date()) {
				await pendingUsersAPI.deletePendingUser(activationLink);
				await userAPI.createUser(email, password);
			} else {
				throw ClientError.ActivationLinkExpiredError();
			}
		} else {
			throw ClientError.BadRequest(
				'Сбой активации: аккаунт уже активирован или ссылка активации недействительна',
			);
		}
	}

	async resendActivationLink(activationLink: string) {
		// * здесь использование as имеет смысл, так как здесь обрабатывается случай, когда ссылка устарела
		// * обновляем токен активации и отправляем письмо
		const { email } = (await pendingUsersAPI.getPendingUserByToken(
			activationLink,
		)) as PendingUser;

		activationLink = await pendingUsersAPI.updatePendingUserToken(email);
		await mailModel.sendActivationMail(
			email,
			`${process.env.SERVER_URL}/api/activate/${activationLink}`,
		);
	}

	async login(email: string, password: string) {
		const user = await userAPI.getUserByEmail(email);
		if (user) {
			const { id_user, password: passwordBD } = user;

			const isPasswordValid = await bcrypt.compare(password, passwordBD);

			if (isPasswordValid) {
				const accessToken = tokenModel.generateAccessToken(id_user, email);
				const { refreshToken, caption } = tokenModel.generateRefreshToken(
					id_user,
					email,
				);
				await tokenAPI.createToken(id_user, refreshToken, caption);

				return { accessToken, refreshToken };
			} else {
				throw ClientError.WrongPassword();
			}
		} else {
			throw ClientError.UserNotFound();
		}
	}

	async logout(refreshToken: string) {
		await tokenModel.removeRefreshToken(refreshToken);
	}
}

export const userModel = new UserModel();
