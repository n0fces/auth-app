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
	body('password').isLength({ min: 3, max: 32 }),
	userController.registration,
);
router.post(
	'/login',
	body('email').isEmail(),
	body('password').isLength({ min: 3, max: 32 }),
	userController.login,
);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get(
	'/resend-activation-link/:link',
	userController.resendActivationLink,
);
// * отдельный роут для получения access токена
router.get('/access', userController.access);
// * отдельный роут для получения refresh токена
router.get('/refresh', userController.refresh);
router.get('*', authMiddleware);

export { router };
