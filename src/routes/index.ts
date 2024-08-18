import { Router } from 'express';
import { userController } from '../jwt/controllers/user-controller';

const router = Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
// надо добавить роут по обновлению ссылки активации, если она устарела
router.get(
	'/resend-activation-link/:link',
	userController.resendActivationLink,
);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);

export { router };
