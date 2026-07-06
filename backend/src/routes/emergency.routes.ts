import { Router } from 'express';
import emergencyController from '../controllers/emergency.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ========== PUBLIC (Authenticated Users) ==========
router.get('/', authenticate, emergencyController.getAll);
router.get('/stats', authenticate, emergencyController.getStats);
router.get('/:id', authenticate, emergencyController.getById);
router.post('/', authenticate, emergencyController.create);
router.put('/:id', authenticate, emergencyController.update);

// ========== ADMIN ONLY ==========
router.post('/:id/assign', authenticate, authorize('ADMIN'), emergencyController.assign);
router.put('/:id', authenticate, authorize('ADMIN'), emergencyController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), emergencyController.delete);
export default router; 