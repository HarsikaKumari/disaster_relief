import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.put('/change-password', authenticate, userController.changePassword);
export default router;