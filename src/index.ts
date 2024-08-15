import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool } from './db';
import { router } from './routes';

import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ?? '5000';

app.use(express.json());
// * не забудь, что при предоставлении секрета необходимо использовать signedCookies
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(cors());
// /api - маршрут, по которому будет отрабатывать роутер
app.use('/api', router);

const start = async () => {
	try {
		pool.on('error', (err) => {
			console.error('Something bad has happened!', err.stack);
		});

		app.listen(PORT, () => {
			console.log(`Server started on PORT = ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
