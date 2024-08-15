export interface User {
	id_user: number;
	password: string;
	email: string;
	is_activated_email: boolean;
}

export interface Token {
	id_token: number;
	id_user: number;
	token: string;
	caption: string;
}
