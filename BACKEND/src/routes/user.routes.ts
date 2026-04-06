import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    uploadAvatar,
    getSavedSpots,
    toggleSaveSpot,
    getAllUsers,
    updateUserRole,
    getBusinessRequests,
    reviewBusinessRequest,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate, updateProfileSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.get('/saved', authenticate, getSavedSpots);
router.post('/saved/:spotId', authenticate, toggleSaveSpot);

// Admin-only user management - specific routes MUST come before /:id routes
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/business-requests', authenticate, authorize('admin'), getBusinessRequests);

// Parameterized routes last
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);
router.put('/:id/business-request', authenticate, authorize('admin'), reviewBusinessRequest);

export default router;
