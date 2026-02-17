import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All admin routes require authentication AND 'admin' role
router.use(authenticate, authorize(['admin']));

router.get('/users', adminController.getAllUsers);
router.put('/users/:id/verify', adminController.verifyUser);
router.get('/reports', adminController.getReports);
router.get('/withdrawals', adminController.getWithdrawals);
router.put('/withdrawals/:id/approve', adminController.approveWithdrawal);

export default router;
