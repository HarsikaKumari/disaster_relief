import { Router } from 'express';
import chatController from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/rooms', chatController.getRooms);
router.get('/rooms/:roomId', chatController.getRoom);
router.get('/rooms/:roomId/messages', chatController.getMessages);
router.get('/unread-count', chatController.getUnreadCount);
router.post('/rooms', chatController.createRoom);
router.post('/emergency-chat', chatController.createEmergencyChat);
router.post('/messages', chatController.sendMessage);  // ✅ ADD THIS
router.post('/messages/:messageId/reaction', chatController.addReaction);
export default router;