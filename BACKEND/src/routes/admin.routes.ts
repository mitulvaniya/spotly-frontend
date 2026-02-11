import { Router } from 'express';
import {
    getAllUsers,
    getPendingSpots,
    updateSpotStatus,
    getAnalytics,
    toggleUserStatus,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All routes require admin role
router.use(authenticate, authorize('admin'));

router.get('/users', getAllUsers);
router.get('/spots/pending', getPendingSpots);
router.put('/spots/:id/status', updateSpotStatus);
router.get('/analytics', getAnalytics);
router.put('/users/:id/toggle-active', toggleUserStatus);

export default router;
