import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', authenticate, usersController.getMe);
router.put('/me', authenticate, usersController.updateProfile);
router.get('/:id', authenticate, usersController.getUserProfile);
router.post('/verify', authenticate, usersController.requestVerification);
router.post('/report', authenticate, usersController.reportUser);
router.post('/block', authenticate, usersController.blockUser);

export default router;
