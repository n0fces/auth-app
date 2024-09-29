import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

class MailModel {
	private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'Gmail',
			host: process.env.SMTP_HOST,
			// порт почтового сервера (либо 465, либо 587)
			port: Number(process.env.SMTP_PORT),
			// так как порт 587, то поставил false
			secure: false,
			// авторизационная информация об аккаунте, с которого будет происходить рассылка
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASSWORD,
			},
		} as SMTPTransport.Options);
	}

	async sendActivationMail(to: string, link: string) {
		return new Promise((resolve, reject) => {
			this.transporter.sendMail(
				{
					from: process.env.SMTP_USER,
					to,
					subject: `Активация аккаунта на ${process.env.CLIENT_URL}`,
					text: '',
					html: `<div><h1>Для активации перейдите по ссылке</h1>
						<a href="${link}">${link}</a></div>`,
				},
				(error, info) => {
					if (error) {
						// здесь, возможно, надо будет сделать повторную попытку отправки
						console.error(`Ошибка в отправки email: ${error.message}`);
						reject(error);
					} else {
						console.log(`Email sent: ${info.response}`);
						resolve(true);
					}
				},
			);
		});
	}

	sendResetPasswordMail(to: string, link: string) {
		return new Promise((resolve, reject) => {
			this.transporter.sendMail(
				{
					from: process.env.SMTP_USER,
					to,
					subject: `Сброс пароля на ${String(process.env.CLIENT_URL)}`,
					text: '',
					html: `<div><h1>Для сброса пароля перейдите по ссылке</h1>
						<a href="${link}">${link}</a></div>`,
				},
				(error, info) => {
					if (error) {
						// здесь, возможно, надо будет сделать повторную попытку отправки
						console.error(`Ошибка в отправки email: ${error.message}`);
						reject(error);
					} else {
						console.log(`Email sent: ${info.response}`);
						resolve(true);
					}
				},
			);
		});
	}
}

export const mailModel = new MailModel();
