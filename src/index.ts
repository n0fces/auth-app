import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

const app = express();

const PORT = process.env.PORT ?? '5000';
app.use(cookieParser());
app.use(cors());

app.listen(PORT, () => {
	console.log(`Server started on PORT = ${PORT}`);
});
