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

// Admin-only user management
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);
router.get('/business-requests', authenticate, authorize('admin'), getBusinessRequests);
router.put('/:id/business-request', authenticate, authorize('admin'), reviewBusinessRequest);

export default router;
