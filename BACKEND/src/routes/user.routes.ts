import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    uploadAvatar,
    getSavedSpots,
    toggleSaveSpot,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate, updateProfileSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.get('/saved', authenticate, getSavedSpots);
router.post('/saved/:spotId', authenticate, toggleSaveSpot);

export default router;
