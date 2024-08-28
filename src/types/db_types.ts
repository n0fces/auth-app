export interface User {
	id_user: number;
	password: string;
	email: string;
}

export interface PendingUser {
	id_user: number;
	email: string;
	password: string;
	activation_token: string;
	resend_expiration: Date;
}

export interface Token {
	id_token: number;
	id_user: number;
	token: string;
	caption: string;
	user_agent: string;
	created_at: Date;
	updated_at: Date;
}
