import { Token } from 'types';
import { query } from './query';

class TokenAPI {
	async createToken(id_user: number, token: string, caption: string) {
		await query(
			'INSERT INTO tokens (id_user, token, caption) VALUES ($1, $2, $3)',
			[id_user, token, caption],
		);
	}
	async getUserByUserId(id_user: number) {
		const result = await query<Token>(
			'SELECT * FROM tokens WHERE id_user = $1',
			[id_user],
		);

		return result.rows;
	}

	async updateTokenByUserId(id_user: number, newToken: string) {
		await query('UPDATE tokens SET token = $1 WHERE id_user = $2', [
			newToken,
			id_user,
		]);
	}
}

export const tokenAPI = new TokenAPI();
