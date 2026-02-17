import { Router } from 'express';
import { premiumController } from '../controllers/premium.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/plans', authenticate, premiumController.getPlans);
router.get('/status', authenticate, premiumController.getStatus);
router.post('/subscribe', authenticate, premiumController.subscribe);

export default router;
