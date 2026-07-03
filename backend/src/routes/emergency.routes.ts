import { Router } from 'express';
import emergencyController from '../controllers/emergency.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, emergencyController.getAll);
router.get('/stats', authenticate, emergencyController.getStats);
router.get('/:id', authenticate, emergencyController.getById);
router.post('/', authenticate, emergencyController.create);
router.put('/:id', authenticate, emergencyController.update);
router.post('/:id/assign', authenticate, emergencyController.assign);

export default router;