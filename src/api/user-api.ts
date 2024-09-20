import { User } from 'types';
import { query } from './query';

class UserAPI {
	async createUser(id_user: number, email: string, password: string) {
		await query(
			'INSERT INTO users (id_user, email, password) VALUES ($1, $2, $3)',
			[id_user, email, password],
		);
	}

	async getUserByEmail(email: string) {
		const result = await query<User>('SELECT * FROM users WHERE email = $1', [
			email,
		]);

		if (result.rows.length === 0) {
			return null;
		}

		return result.rows[0];
	}

	async getUserById(id_user: string) {
		const result = await query<Pick<User, 'email'>>(
			'SELECT email FROM users WHERE id_user = $1',
			[id_user],
		);

		if (result.rows.length === 0) {
			return null;
		}

		return result.rows[0];
	}

	async updateUserPassword(email: string, newPassword: string) {
		await query('UPDATE users SET password = $2 WHERE email = $1', [
			email,
			newPassword,
		]);
	}
}

export const userAPI = new UserAPI();
