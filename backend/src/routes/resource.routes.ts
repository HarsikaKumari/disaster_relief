import { Router } from 'express';
import resourceController from '../controllers/resource.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.get('/deployments', authenticate, resourceController.getDeployments);
router.get('/', authenticate, resourceController.getAll);
router.get('/stats', authenticate, resourceController.getStats);
router.post('/', authenticate, resourceController.create);
router.post('/request', authenticate, resourceController.requestResource);
router.post('/deploy', authenticate, resourceController.deployResource);
router.put('/deployments/:deploymentId/status', authenticate, resourceController.updateDeploymentStatus);
router.get('/:id', authenticate, resourceController.getById);
router.put('/:id', authenticate, resourceController.update);
export default router;