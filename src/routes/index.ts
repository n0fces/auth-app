/* eslint-disable @typescript-eslint/unbound-method -- в коде контроллеров и моделей нигде не используются контекст извне*/
/* eslint-disable @typescript-eslint/no-misused-promises -- в коде приложения есть app.use(errorMiddleware), который перехватывает все ошибки */
import { Router } from 'express';
import { userController } from 'jwt/controllers/user-controller';
import { body } from 'express-validator';
import { authMiddleware } from 'middlewares/auth-middleware';

const router = Router();

// ! Необходимо уточнить валидацию данных либо вообще убрать, так как и так это делается на фронтенде
//  роут для регистрации
router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	userController.registration,
);
//  роут для входа в аккаунта
router.post(
	'/login',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	userController.login,
);
//  роут для выхода из аккаунта
router.post('/logout', userController.logout);
//  роут для активации аккаунта
router.get('/activate/:link', userController.activate);
//  роут для повторной отправки ссылки активации аккаунта
router.get('/resend-activation-link', userController.resendActivationLink);
//  роут для отправки ссылки по сбросу пароля на указанную почту
router.post(
	'/forgot-password',
	body('email').isEmail(),
	userController.forgotPassword,
);
//  роут для повторной отправки ссылки по сбросу пароля
router.post('/resend-forgot-password', userController.resendForgotPasswords);
//  роут для проверки ссылки сброса пароля
router.get('/reset-password-access/:token', userController.resetPasswordAccess);
//  роут для сброса пароля
router.post(
	'/reset-password',
	body('password').isLength({ min: 8, max: 32 }),
	userController.resetPassword,
);
//  роут для обновления access токена
router.get('/access', userController.access);
//  роут для обновления refresh токена
router.get('/refresh', userController.refresh);
//  роут, который отвечает за проверку того, есть ли у пользователя доступ к контенту через access токен
router.get('/check-access', authMiddleware, userController.checkAccess);
// получение данных о пользователе
router.get('/get-user', authMiddleware, userController.getUser);

export { router };
