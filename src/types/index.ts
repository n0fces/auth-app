export interface User {
	id_user: number;
	password: string;
	email: string;
}

export interface PendingUser {
	email: string;
	password: string;
	token_expiration: Date;
	activation_token: string;
}

export interface Token {
	id_token: number;
	id_user: number;
	token: string;
	caption: string;
}
