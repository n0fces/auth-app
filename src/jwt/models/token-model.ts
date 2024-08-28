import { tokenAPI } from 'api';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { AccessPayload, ActivationPayload, RefreshPayload } from 'types';
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

	verifyRefreshToken(refresh: any) {
		try {
			const userPayload = jwt.verify(
				refresh,
				process.env.JWT_REFRESH_SECRET as string,
			);
			return userPayload as RefreshPayload;
		} catch (error) {
			return null;
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
			return null;
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
			return null;
		}
	}

	decodeRefreshToken(token: string) {
		return jwt.decode(token) as RefreshPayload;
	}

	async removeRefreshToken(sub?: string) {
		const user_id = String(sub);
		await tokenAPI.removeTokenByUserId(user_id);
	}
}

export const tokenModel = new TokenModel();
