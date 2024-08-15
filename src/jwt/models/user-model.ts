import { tokenAPI, userAPI } from 'api';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { v4 } from 'uuid';
import { twoStepAuth } from './2fa-model';
import { tokenService } from './token-model';

class UserModel {
	async registration(email: string, password: string) {
		const candidate = await userAPI.getUserByEmail(email);

		if (candidate) {
			throw new Error(
				`Пользователь с почтовым адресом ${email} уже существует`,
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const { id_user } = await userAPI.createUser(email, hashedPassword);

		const activationLink = v4();
		await twoStepAuth.sendActivationMail(email, activationLink);

		const accessToken = tokenService.generateAccessToken(id_user, email);
		const { refreshToken, caption } = tokenService.generateRefreshToken(
			id_user,
			email,
		);
		await tokenAPI.createToken(id_user, refreshToken, caption);

		// * здесь возможно нужно будет передавать еще какую-то информацию о пользователе
		return { accessToken, refreshToken, caption };
	}
}

export const userModel = new UserModel();
