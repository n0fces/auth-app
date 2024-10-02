import { pendingUsersAPI, tokenAPI, userAPI } from 'api';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { ClientError } from 'errors/client-error';
import { getUA } from 'utils/getUA';
import { mailModel } from './mail-model';
import { tokenModel } from './token-model';
import { isString } from 'utils/isString';

// ! очень надо разгрузить эту модель
class UserModel {
	async registration(email: string, password: string) {
		// Проверка того, что пользователь уже существует
		const candidate = await userAPI.getUserByEmail(email);
		if (candidate) {
			throw ClientError.UserAlreadyExisted();
		}

		// Проверка того, что пользователь первый раз проходит регистрацию
		// или пользователь когда-то давно пытался пройти регистрацию, но его уже очистило
		// из таблицы pending_users
		const candidatePendingUser =
			await pendingUsersAPI.getPendingUserByEmail(email);

		// здесь необходимо еще пробросить пароль, потому что пользователь может начать регистрацию
		// на одном устройстве, а потом начать ее проходить на другом, причем пароль он, возможно,
		// напишет другой
		const hashedPassword = await bcrypt.hash(password, 10);
		const activationToken = tokenModel.generateActivationToken(email);
		if (candidatePendingUser) {
			await pendingUsersAPI.updatePendingUserToken(
				email,
				activationToken,
				hashedPassword,
			);
		} else {
			await pendingUsersAPI.createPendingUser(
				email,
				activationToken,
				hashedPassword,
			);
		}

		// отправляем письмо с ссылкой активации на указанную почту
		await mailModel.sendActivationMail(
			email,
			`${String(process.env.SERVER_URL)}/auth/activate/${activationToken}`,
		);
	}

	// * этот метод нужно очень качественно задокументировать
	async activate(activationToken: string, userAgent: string | undefined) {
		const payload = tokenModel.verifyActivationToken(activationToken);
		const { email } = payload;
		const pendingUser = await pendingUsersAPI.getPendingUserByEmail(email);
		if (pendingUser) {
			const { id_user, email, password, activation_token } = pendingUser;

			if (activation_token === activationToken) {
				await pendingUsersAPI.deletePendingUserById(id_user);
				await userAPI.createUser(id_user, email, password);

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
				throw ClientError.BadRequest(
					'Сбой активации: ссылка активации невалидна',
				);
			}
		} else {
			throw ClientError.UserAlreadyExisted();
		}
	}

	async resendActivationLink(email: string) {
		const activationToken = tokenModel.generateActivationToken(email);
		await pendingUsersAPI.updatePendingUserToken(email, activationToken);
		await mailModel.sendActivationMail(
			email,
			`${String(process.env.SERVER_URL)}/auth/activate/${activationToken}`,
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
		const { sub } = tokenModel.decodeRefreshToken(refreshToken);
		await tokenModel.removeRefreshToken(sub);
	}

	async forgotPassword(email: string) {
		const user = await userAPI.getUserByEmail(email);
		if (user) {
			const { id_user } = user;
			const resetToken = tokenModel.generateResetPasswordToken(id_user, email);
			await mailModel.sendResetPasswordMail(
				email,
				`${String(process.env.SERVER_URL)}/auth/reset-password-access/${resetToken}`,
			);
		} else {
			throw ClientError.UserNotFound();
		}
	}

	async resetPassword(email: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, 10);
		await userAPI.updateUserPassword(email, hashedPassword);
	}

	// async logoutAllDevices(email: string) {
	// 	const user = await userAPI.getUserByEmail(email);
	// 	if (user) {
	// 		const { id_user } = user;
	// 		await tokenAPI.deleteAllTokensByUserId(id_user);
	// 	} else {
	// 		throw ClientError.UserNotFound();
	// 	}
	// }

	async updateRefresh(refresh: string, userAgent: string | undefined) {
		if (refresh) {
			const { sub, email, jti, iat } = tokenModel.decodeRefreshToken(refresh);
			const id_user = Number(sub);

			// ! надо будет переформулировать, потому что сейчас непонятно звучит
			const tokens = await tokenAPI.getUserByUserId(id_user);
			const tokenSession = tokens.find((token) => token.token === refresh);

			const uaJSON = getUA(userAgent);

			const isEqualCaption = tokenSession?.caption === jti;
			const isEqualUpdatedTime = tokenSession?.updated_at.getTime() === iat;
			const isEqualUserAgent = tokenSession?.user_agent === uaJSON;
			if (
				tokenSession &&
				isEqualCaption &&
				isEqualUpdatedTime &&
				isEqualUserAgent
			) {
				const accessToken = tokenModel.generateAccessToken(id_user, email);
				const { refreshToken } = tokenModel.generateRefreshToken(
					id_user,
					email,
					uaJSON,
				);

				await tokenAPI.updateTokenByUserId(id_user, refreshToken);

				return { accessToken, refreshToken };
				// ! в обоих этих else на самом деле не буду прокидывать ошибку, а отдельно буду обрабатывать это
			} else {
				// ! здесь надо будет добавить логику, связанную с блэк-листом
				// ! здесь надо добавить логику с логированием
				throw ClientError.ForbiddenError();
			}
		} else {
			// ! здесь надо добавить логику с логированиемuser
			throw ClientError.UnauthorizedError();
		}
	}

	updateAccess(refreshToken: string) {
		const tokenData = tokenModel.verifyRefreshToken(refreshToken);

		const { sub, email } = tokenData;
		if (isString(sub)) {
			const id_user = Number(sub);
			const accessToken = tokenModel.generateAccessToken(id_user, email);
			return accessToken;
		}
	}

	async getUser(userId: string) {
		return await userAPI.getUserById(userId);
	}
}

export const userModel = new UserModel();
