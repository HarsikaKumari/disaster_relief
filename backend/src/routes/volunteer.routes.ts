import { Router } from 'express';
import volunteerController from '../controllers/volunteer.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public (Authenticated)
router.get('/', authenticate, volunteerController.getAllVolunteers);
router.get('/stats', authenticate, volunteerController.getVolunteerStats);
router.get('/:id', authenticate, volunteerController.getVolunteerById);

// Protected (Admin only)
router.put('/:id', authenticate, authorize('ADMIN'), volunteerController.updateVolunteer);
router.post('/:id/verify', authenticate, authorize('ADMIN'), volunteerController.verifyVolunteer);
router.delete('/:id', authenticate, authorize('ADMIN'), volunteerController.deleteVolunteer);
router.post('/:id/assign', authenticate, authorize('ADMIN'), volunteerController.assignToEmergency);

export default router;