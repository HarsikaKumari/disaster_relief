import { Router } from 'express';
import dashboardController from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/stats', authenticate, dashboardController.getStats);
router.get('/activities', authenticate, dashboardController.getRecentActivities);

export default router;