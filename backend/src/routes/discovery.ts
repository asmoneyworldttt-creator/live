import { Router } from 'express';
import { discoveryController } from '../controllers/discovery.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/feed', authenticate, discoveryController.getFeed);
router.post('/like', authenticate, discoveryController.likeUser);
router.post('/nope', authenticate, discoveryController.nopeUser);
router.get('/matches', authenticate, discoveryController.getMatches);

export default router;
