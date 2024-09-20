import { tokenAPI } from 'api';
import 'dotenv/config';
import { ClientError } from 'errors/client-error';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AccessPayload, ActivationPayload, RefreshPayload } from 'types';
import { ResetPayload } from 'types/payload_types';
import { v4 } from 'uuid';

class TokenModel {
	private generateRefreshPayload(
		id_user: number,
		email: string,
		userAgent: string,
	) {
		const caption = v4();

		const payload: RefreshPayload = {
			iss: process.env.SERVER_URL,
			sub: String(id_user),
			aud: process.env.CLIENT_URL,
			iat: Date.now(),
			jti: caption,
			email_verified: true,
			email,
			userAgent,
		};

		return { payload, caption, userAgent };
	}
	private generateAccessPayload(id_user: number, email: string) {
		const payload: AccessPayload = {
			iss: process.env.SERVER_URL,
			sub: String(id_user),
			aud: process.env.CLIENT_URL,
			iat: Date.now(),
			jti: v4(),
			email_verified: true,
			email,
		};

		return payload;
	}

	private generateActivationPayload(email: string) {
		const payload: ActivationPayload = {
			iss: process.env.SERVER_URL,
			iat: Date.now(),
			jti: v4(),
			email,
		};

		return payload;
	}

	private generateResetPayload(id_user: number, email: string) {
		return this.generateAccessPayload(id_user, email);
	}

	generateAccessToken(id_user: number, email: string) {
		const payload = this.generateAccessPayload(id_user, email);
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_SECRET as string,
			{ expiresIn: process.env.ACCESS_TOKEN_LIFE },
		);

		return accessToken;
	}
	generateRefreshToken(id_user: number, email: string, uaJSON: string) {
		const { payload, caption, userAgent } = this.generateRefreshPayload(
			id_user,
			email,
			uaJSON,
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET as string,
			{ expiresIn: process.env.REFRESH_TOKEN_LIFE },
		);

		return { refreshToken, caption, userAgent };
	}

	generateActivationToken(email: string) {
		const payload = this.generateActivationPayload(email);
		const activationToken = jwt.sign(
			payload,
			process.env.JWT_ACTIVATION_SECRET as string,
			{ expiresIn: process.env.ACTIVATION_TOKEN_LIFE },
		);

		return activationToken;
	}

	generateResetPasswordToken(id_user: number, email: string) {
		const payload = this.generateResetPayload(id_user, email);
		const resetToken = jwt.sign(
			payload,
			process.env.JWT_RESET_PASSWORD_SECRET as string,
			{ expiresIn: '10m' },
		);

		return resetToken;
	}

	// ! в методах проверки токенов на валидность надо проработать кейсы
	// ! невалидных токенов. Для рефреш токенов, скорее всего, завести
	// ! блэк лист. Для невалидных токенов доступа добавить функционал
	// ! логирования информации об этом
	verifyRefreshToken(refresh: any) {
		try {
			const userPayload = jwt.verify(
				refresh,
				process.env.JWT_REFRESH_SECRET as string,
			);
			return userPayload as RefreshPayload;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw ClientError.RefreshTokenExpired();
			} else if (error instanceof JsonWebTokenError) {
				throw ClientError.RefreshTokenInvalid();
			} else {
				throw ClientError.UnauthorizedError();
			}
		}
	}

	verifyAccessToken(access: string) {
		try {
			const userPayload = jwt.verify(
				access,
				process.env.JWT_ACCESS_SECRET as string,
			);
			return userPayload as AccessPayload;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw ClientError.AccessTokenExpired();
			} else if (error instanceof JsonWebTokenError) {
				throw ClientError.AccessTokenInvalid();
			} else {
				throw ClientError.UnauthorizedError();
			}
		}
	}

	verifyActivationToken(activation: string) {
		try {
			const activationPayload = jwt.verify(
				activation,
				process.env.JWT_ACTIVATION_SECRET as string,
			);
			return activationPayload as ActivationPayload;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw ClientError.ActivationLinkExpired();
			} else if (error instanceof JsonWebTokenError) {
				throw ClientError.BadRequest(
					'Сбой активации: ссылка активации невалидна',
				);
			} else {
				throw ClientError.BadRequest(
					'Сбой активации: ссылка активации устарела, или она недействительна',
				);
			}
		}
	}

	verifyResetToken(token: string) {
		try {
			const resetPayload = jwt.verify(
				token,
				process.env.JWT_RESET_PASSWORD_SECRET as string,
			);
			return resetPayload as ResetPayload;
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw ClientError.ActivationLinkExpired();
			} else if (error instanceof JsonWebTokenError) {
				throw ClientError.BadRequest(
					'Сбой активации: ссылка активации невалидна',
				);
			} else {
				throw ClientError.BadRequest(
					'Сбой активации: ссылка активации устарела, или она недействительна',
				);
			}
		}
	}

	decodeRefreshToken(token: string) {
		return jwt.decode(token) as RefreshPayload;
	}

	decodeResetToken(token: string) {
		return jwt.decode(token) as ResetPayload;
	}

	async removeRefreshToken(sub?: string) {
		const user_id = String(sub);
		await tokenAPI.removeTokenByUserId(user_id);
	}
}

export const tokenModel = new TokenModel();
