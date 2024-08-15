CREATE DATABASE auth_server
WITH
	OWNER = postgres ENCODING = 'UTF8' LOCALE_PROVIDER = 'libc' CONNECTION
LIMIT
	= -1 IS_TEMPLATE = False;

CREATE TABLE users (
	id_user SERIAL PRIMARY KEY,
	password VARCHAR(255) NOT NULL,
	email VARCHAR(255) UNIQUE NOT NULL,
	is_activated_email BOOLEAN DEFAULT false
);

CREATE TABLE tokens (
	id_token SERIAL PRIMARY KEY,
	id_user INTEGER REFERENCES users (id_user) NOT NULL,
	token TEXT UNIQUE NOT NULL,
	caption TEXT NOT NULL
);

CREATE INDEX idx_user_id ON tokens (id_user);
