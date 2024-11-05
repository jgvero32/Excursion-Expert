import { Router } from 'express';
import { UserController } from './controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/all', authenticateToken, UserController.getAllUsers.bind(UserController));
router.get('/profile', authenticateToken, UserController.getProfile.bind(UserController));
router.put('/profile', authenticateToken, UserController.updateProfile.bind(UserController));

export default router;