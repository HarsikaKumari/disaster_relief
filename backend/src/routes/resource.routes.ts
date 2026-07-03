import { Router } from 'express';
import resourceController from '../controllers/resource.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, resourceController.getAll);
router.get('/stats', authenticate, resourceController.getStats);
router.get('/:id', authenticate, resourceController.getById);
router.post('/', authenticate, resourceController.create);
router.put('/:id', authenticate, resourceController.update);
router.post('/request', authenticate, resourceController.requestResource);
router.post('/deploy', authenticate, resourceController.deployResource);

export default router;