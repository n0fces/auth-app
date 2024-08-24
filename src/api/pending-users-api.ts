import { PendingUser } from 'types';
import { query } from './query';

class PendingUsersAPI {
	async createPendingUser(email: string, hashedPassword: string) {
		const result = await query<Pick<PendingUser, 'activation_token'>>(
			'INSERT INTO pending_users (email, password) VALUES ($1, $2) RETURNING activation_token',
			[email, hashedPassword],
		);

		return result.rows[0].activation_token;
	}

	async getPendingUserByEmail(email: string) {
		const result = await query<Pick<PendingUser, 'email'>>(
			'SELECT email FROM pending_users WHERE email = $1',
			[email],
		);

		return result.rows.length === 0 ? null : result.rows[0].email;
	}

	async updatePendingUserToken(email: string, hashedPassword?: string) {
		const queryText = `
			UPDATE pending_users 
			SET 
				${hashedPassword ? 'password = $2,' : ''}
				activation_token = uuid_generate_v4(),
				token_expiration = NOW() + INTERVAL '10 minutes'
			WHERE email = $1 
			RETURNING activation_token`;

		const values = hashedPassword ? [email, hashedPassword] : [email];

		const result = await query<Pick<PendingUser, 'activation_token'>>(
			queryText,
			values,
		);

		return result.rows[0].activation_token;
	}

	async getPendingUserByToken(activation_token: string) {
		const result = await query<PendingUser>(
			'SELECT * FROM pending_users WHERE activation_token = $1',
			[activation_token],
		);

		return result.rows.length === 0 ? null : result.rows[0];
	}

	async updateResendExpiration(email: string) {
		const result = await query<Pick<PendingUser, 'email'>>(
			`
			UPDATE pending_users
			SET 
				resend_expiration = NOW() + INTERVAL '1 day',
				resend_limit = resend_limit - 1
			WHERE
				email = $1 AND resend_limit > 0
			RETURNING email`,
			[email],
		);

		return result.rows.length > 0;
	}

	async deletePendingUser(activation_token: string) {
		await query('DELETE FROM pending_users WHERE activation_token = $1', [
			activation_token,
		]);
	}
}

export const pendingUsersAPI = new PendingUsersAPI();
