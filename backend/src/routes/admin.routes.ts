import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN'));

// ========== DASHBOARD ==========
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/activities', adminController.getRecentActivities);

// ========== USERS ==========
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users/:id/verify', adminController.verifyUser);
router.put('/users/:id/ban', adminController.banUser);
router.put('/users/:id/unban', adminController.unbanUser);
router.put('/users/:id/role', adminController.changeUserRole);
router.delete('/users/:id', adminController.deleteUser);

// ========== SYSTEM ==========
router.get('/system/stats', adminController.getSystemStats);

export default router;