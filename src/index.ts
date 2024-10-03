import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorMiddleware } from 'middlewares/error-middleware';
import { pool } from './db';
import { router } from './routes';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: process.env.CLIENT_URL,
	}),
);
// /auth - маршрут, по которому будет отрабатывать роутер
app.use('/auth', router);
app.use(errorMiddleware);

const start = () => {
	pool.on('error', (err) => {
		console.error('Something bad has happened!', err.stack);
	});

	app.listen(PORT, () => {
		console.log(`Server started on PORT = ${PORT}`);
	});
};

start();
