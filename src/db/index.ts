import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// можно потом включить настройку ssl
export const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
});
