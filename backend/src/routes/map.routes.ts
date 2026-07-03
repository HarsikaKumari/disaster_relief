import { Router } from 'express';
import mapController from '../controllers/map.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/emergencies', authenticate, mapController.getEmergencies);
router.get('/resources', authenticate, mapController.getResources);
router.get('/stats', authenticate, mapController.getMapStats);

export default router;