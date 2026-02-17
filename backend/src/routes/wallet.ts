import { Router } from 'express';
import { walletController } from '../controllers/wallet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/balance', authenticate, walletController.getBalance);
router.get('/transactions', authenticate, walletController.getTransactions);
router.post('/withdraw', authenticate, walletController.requestWithdrawal);

export default router;
