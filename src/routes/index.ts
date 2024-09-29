/* eslint-disable @typescript-eslint/unbound-method -- в коде контроллеров и моделей нигде не используются контекст извне*/
/* eslint-disable @typescript-eslint/no-misused-promises -- в коде приложения есть app.use(errorMiddleware), который перехватывает все ошибки */
import { Router } from 'express';
import { userController } from 'jwt/controllers/user-controller';
import { body } from 'express-validator';
import { authMiddleware } from 'middlewares/auth-middleware';

const router = Router();

// ! Здесь надо как-то отдельно и более четко оформить валидацию введенных данных
// ! Вообще на клиенте еще надо бить по руками пользователя, который вводит каку
router.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	userController.registration,
);
router.post(
	'/login',
	body('email').isEmail(),
	body('password').isLength({ min: 8, max: 32 }),
	userController.login,
);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/resend-activation-link', userController.resendActivationLink);
router.post(
	'/forgot-password',
	body('email').isEmail(),
	userController.forgotPassword,
);
router.post('/resend-forgot-password', userController.resendForgotPasswords);
router.get('/reset-password-access/:token', userController.resetPasswordAccess);
router.post(
	'/reset-password',
	body('password').isLength({ min: 8, max: 32 }),
	userController.resetPassword,
);
// * отдельный роут для получения access токена
router.get('/access', userController.access);
// * отдельный роут для получения refresh токена
router.get('/refresh', userController.refresh);
// * роут, который будет отвечать за проверку того, есть ли у пользователя доступ к контенту
router.get('/check-access', authMiddleware, userController.checkAccess);
router.get('/get-user', authMiddleware, userController.getUser);

export { router };
