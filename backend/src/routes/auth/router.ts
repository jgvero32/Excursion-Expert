import { Router } from 'express';
import { AuthController } from './controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.post('/login', AuthController.login.bind(AuthController));
router.post('/register', AuthController.register.bind(AuthController));
router.get('/me', authenticateToken, AuthController.getCurrentUser.bind(AuthController));
router.post('/logout', authenticateToken, AuthController.logout.bind(AuthController));

export default router;