import { User } from 'types';
import { query } from './query';

class UserAPI {
	async createUser(email: string, password: string) {
		await query('INSERT INTO users (password, email) VALUES ($1, $2)', [
			password,
			email,
		]);
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
}

export const userAPI = new UserAPI();
