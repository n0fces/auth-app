import { pendingUsersAPI, tokenAPI, userAPI } from 'api';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { ClientError } from 'errors/client-error';
import { PendingUser } from 'types';
import { mailModel } from './mail-model';
import { tokenModel } from './token-model';
import { getUA } from 'utils/getUA';

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
				const youCanGetNewLink =
					await pendingUsersAPI.updateResendExpiration(email);
				if (youCanGetNewLink) {
					throw ClientError.ActivationLinkExpiredError();
				} else {
					throw ClientError.TooManyResendRequests();
				}
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

	async login(email: string, password: string, userAgent: string | undefined) {
		const user = await userAPI.getUserByEmail(email);
		if (user) {
			const { id_user, password: passwordBD } = user;

			const isPasswordValid = await bcrypt.compare(password, passwordBD);

			if (isPasswordValid) {
				const uaJSON = getUA(userAgent);
				const accessToken = tokenModel.generateAccessToken(id_user, email);
				const {
					refreshToken,
					caption,
					userAgent: userAgentDB,
				} = tokenModel.generateRefreshToken(id_user, email, uaJSON);
				await tokenAPI.createToken(id_user, refreshToken, caption, userAgentDB);

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

	async refresh(refreshToken: any, userAgent: string | undefined) {
		const tokenData = tokenModel.verifyRefreshToken(refreshToken);

		if (tokenData) {
			const { sub, email } = tokenData;
			const id_user = Number(sub as string);
			const uaJSON = getUA(userAgent);
			const accessToken = tokenModel.generateAccessToken(id_user, email);
			const { refreshToken } = tokenModel.generateRefreshToken(
				id_user,
				email,
				uaJSON,
			);

			await tokenAPI.updateTokenByUserId(id_user, refreshToken);

			return { accessToken, refreshToken };
		} else {
			throw ClientError.UnauthorizedError();
		}
	}
}

export const userModel = new UserModel();
