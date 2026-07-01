import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();


router.post('/register', authController.register);

router.post('/send-otp', authController.sendOTP);

router.post('/verify-otp', authController.verifyOTP);

router.post('/resend-otp', authController.resendOTP);

router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

// ========== PROTECTED ROUTES ==========

// Logout
router.post('/logout', authenticate, authController.logout);

// Get current user profile
router.get('/profile', authenticate, authController.getProfile);

export default router;