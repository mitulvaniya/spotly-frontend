import { Router } from 'express';
import { claimBusiness, getDashboard, getOwnedSpots } from '../controllers/business.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/claim/:spotId', authenticate, authorize('business_owner', 'admin'), claimBusiness);
router.get('/dashboard', authenticate, authorize('business_owner', 'admin'), getDashboard);
router.get('/spots', authenticate, authorize('business_owner', 'admin'), getOwnedSpots);

export default router;
