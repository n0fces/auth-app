import { tokenAPI } from 'api';
import 'dotenv/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 } from 'uuid';

class TokenModel {
	private generatePayload(id_user: number, email: string) {
		const caption = v4();

		const payload: JwtPayload = {
			iss: process.env.SERVER_URL,
			sub: String(id_user),
			aud: process.env.CLIENT_URL,
			iat: Date.now(),
			jti: caption,
			email,
		};

		return { payload, caption };
	}

	generateAccessToken(id_user: number, email: string) {
		const { payload } = this.generatePayload(id_user, email);
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_SECRET as string,
			{ expiresIn: process.env.ACCESS_TOKEN_LIFE },
		);

		return accessToken;
	}
	generateRefreshToken(id_user: number, email: string) {
		const { payload, caption } = this.generatePayload(id_user, email);
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_SECRET as string,
			{ expiresIn: process.env.REFRESH_TOKEN_LIFE },
		);

		return { refreshToken, caption };
	}

	async removeRefreshToken(refreshToken: string) {
		await tokenAPI.removeTokenByToken(refreshToken);
	}
}

export const tokenModel = new TokenModel();
