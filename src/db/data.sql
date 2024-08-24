CREATE DATABASE auth_server
WITH
	OWNER = postgres ENCODING = 'UTF8' LOCALE_PROVIDER = 'libc' CONNECTION
LIMIT
	= -1 IS_TEMPLATE = False;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id_user PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE pending_users (
	id_user SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	token_expiration TIMESTAMP NOT NULL DEFAULT NOW () + INTERVAL '10 minutes',
	activation_token UUID NOT NULL DEFAULT uuid_generate_v4 (),
	resend_expiration TIMESTAMP NOT NULL DEFAULT NOW () + INTERVAL '1 day',
	resend_limit INTEGER DEFAULT 3
);

CREATE INDEX idx_activation_token ON pending_users (activation_token);

CREATE TABLE tokens (
	id_token SERIAL PRIMARY KEY,
	id_user INTEGER REFERENCES users (id_user) NOT NULL,
	token TEXT UNIQUE NOT NULL,
	caption TEXT NOT NULL,
	userAgentDB TEXT NOT NULL
);

CREATE INDEX idx_user_id ON tokens (id_user);
