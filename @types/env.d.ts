declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string;
		COOKIE_PARSER_SECRET: string;
		DB_USER: string;
		DB_HOST: string;
		DB_DATABASE: string;
		DB_PASSWORD: string;
		DB_PORT: string;
		JWT_ACCESS_SECRET: string;
		JWT_REFRESH_SECRET: string;
		JWT_ACTIVATION_SECRET: string;
		JWT_RESET_PASSWORD_SECRET: string;
		ACCESS_TOKEN_LIFE: string;
		REFRESH_TOKEN_LIFE: string;
		ACTIVATION_TOKEN_LIFE: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_USER: string;
		SMTP_PASSWORD: string;
		CLIENT_URL: string;
		SERVER_URL: string;
	}
}
