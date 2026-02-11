import { Router } from 'express';
import {
    getSpots,
    getSpot,
    createSpot,
    updateSpot,
    deleteSpot,
    getNearbySpots,
} from '../controllers/spot.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { validate, createSpotSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.get('/', optionalAuth, getSpots);
router.get('/nearby', getNearbySpots);
router.get('/:id', optionalAuth, getSpot);

router.post(
    '/',
    authenticate,
    authorize('business_owner', 'admin'),
    upload.fields([
        { name: 'featuredImage', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    validate(createSpotSchema),
    createSpot
);

router.put(
    '/:id',
    authenticate,
    authorize('business_owner', 'admin'),
    upload.fields([
        { name: 'featuredImage', maxCount: 1 },
        { name: 'images', maxCount: 5 },
    ]),
    updateSpot
);

router.delete('/:id', authenticate, authorize('admin'), deleteSpot);

export default router;
