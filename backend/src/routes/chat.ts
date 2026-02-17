import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, chatController.getConversations);
router.get('/:id/messages', authenticate, chatController.getMessages);
router.post('/:id/messages', authenticate, chatController.sendMessage);
router.post('/group', authenticate, chatController.createGroup);

export default router;
