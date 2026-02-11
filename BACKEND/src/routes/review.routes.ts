import { Router } from 'express';
import {
    getSpotReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';
import { validate, createReviewSchema } from '../middleware/validation';
import { upload } from '../utils/upload';

const router = Router();

router.get('/spot/:spotId', getSpotReviews);
router.post('/', authenticate, upload.array('images', 5), validate(createReviewSchema), createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);
router.post('/:id/helpful', authenticate, markHelpful);

export default router;
