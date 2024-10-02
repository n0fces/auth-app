import { Token } from 'types';
import { query } from './query';

class TokenAPI {
	async createToken(
		id_user: number,
		token: string,
		caption: string,
		userAgentDB: string,
	) {
		await query(
			'INSERT INTO tokens (id_user, token, caption, user_agent) VALUES ($1, $2, $3, $4)',
			[id_user, token, caption, userAgentDB],
		);
	}
	async getUserByUserId(id_user: number) {
		const result = await query<Token>(
			'SELECT * FROM tokens WHERE id_user = $1',
			[id_user],
		);

		return result.rows;
	}

	async removeTokenByUserId(id_user: string) {
		await query('DELETE FROM tokens WHERE id_user = $1', [id_user]);
	}

	async updateTokenByUserId(id_user: number, newToken: string) {
		await query(
			`
			UPDATE tokens 
			SET token = $1 
				updated_at = NOW()
			WHERE id_user = $2`,
			[newToken, id_user],
		);
	}

	// async deleteAllTokensByUserId(id_user: number) {
	// 	await query('DELETE FROM tokens WHERE id_user = $1', [id_user]);
	// }
}

export const tokenAPI = new TokenAPI();
