import { PendingUser } from 'types';
import { query } from './query';

class PendingUsersAPI {
	async createPendingUser(
		email: string,
		activationToken: string,
		hashedPassword: string,
	) {
		await query(
			'INSERT INTO pending_users (email, activation_token, password) VALUES ($1, $2, $3)',
			[email, activationToken, hashedPassword],
		);
	}

	async updatePendingUserToken(
		email: string,
		activationToken: string,
		hashedPassword?: string,
	) {
		const queryText = `
			UPDATE pending_users 
			SET 
				${hashedPassword ? 'password = $3,' : ''}
				activation_token = $2,
				resend_expiration = NOW() + INTERVAL '1 day'
			WHERE email = $1`;

		const values = hashedPassword
			? [email, activationToken, hashedPassword]
			: [email, activationToken];

		await query(queryText, values);
	}

	async getPendingUserByEmail(email: string) {
		const result = await query<PendingUser>(
			'SELECT * FROM pending_users WHERE email = $1',
			[email],
		);

		return result.rows.length === 0 ? null : result.rows[0];
	}

	async deletePendingUserById(id_user: number) {
		await query('DELETE FROM pending_users WHERE id_user = $1', [id_user]);
	}
}

export const pendingUsersAPI = new PendingUsersAPI();
