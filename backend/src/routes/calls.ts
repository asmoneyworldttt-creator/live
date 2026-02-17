import { Router } from 'express';
import { callsController } from '../controllers/calls.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/initiate', authenticate, callsController.initiateCall);
router.post('/end', authenticate, callsController.endCall);
router.get('/history', authenticate, callsController.getCallHistory);
router.get('/analytics', authenticate, callsController.getCallAnalytics);

export default router;
