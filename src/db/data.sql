CREATE DATABASE auth_server
WITH
	OWNER = postgres ENCODING = 'UTF8' LOCALE_PROVIDER = 'libc' CONNECTION
LIMIT
	= -1 IS_TEMPLATE = False;

CREATE TABLE users (
	id_user INTEGER PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE pending_users (
	id_user SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	activation_token TEXT NOT NULL,
	resend_expiration TIMESTAMP NOT NULL DEFAULT NOW () + INTERVAL '1 day',
);

CREATE INDEX idx_email ON pending_users (email);

CREATE TABLE tokens (
	id_token SERIAL PRIMARY KEY,
	id_user INTEGER REFERENCES users (id_user) NOT NULL,
	token TEXT UNIQUE NOT NULL,
	caption TEXT NOT NULL,
	user_agent TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT NOW (),
	updated_at TIMESTAMP NOT NULL DEFAULT NOW ()
);
