import { Request, Response } from 'express';
import Review from '../models/Review';
import Spot from '../models/Spot';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { uploadMultipleToCloudinary } from '../utils/upload';

// @desc    Get reviews for a spot
// @route   GET /api/reviews/spot/:spotId
// @access  Public
export const getSpotReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { spotId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({ spot: spotId, status: 'approved' })
        .populate('user', 'name avatar')
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum);

    const total = await Review.countDocuments({ spot: spotId, status: 'approved' });

    res.status(200).json({
        success: true,
        data: {
            reviews,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { spot, rating, text } = req.body;

    // Check if spot exists
    const spotExists = await Spot.findById(spot);
    if (!spotExists) {
        throw new AppError('Spot not found', 404);
    }

    // Check if user already reviewed this spot
    const existingReview = await Review.findOne({
        user: req.user._id,
        spot,
    });

    if (existingReview) {
        throw new AppError('You have already reviewed this spot', 400);
    }

    // Handle image uploads
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
        images = await uploadMultipleToCloudinary(req.files, 'spotly/reviews');
    }

    const review = await Review.create({
        user: req.user._id,
        spot,
        rating,
        text,
        images,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: {
            review: populatedReview,
        },
    });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check ownership
    if (review.user.toString() !== req.user._id.toString()) {
        throw new AppError('Not authorized to update this review', 403);
    }

    const { rating, text } = req.body;

    review = await Review.findByIdAndUpdate(
        req.params.id,
        { rating, text },
        { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: {
            review,
        },
    });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AppError('Not authorized to delete this review', 403);
    }

    await review.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
    });
});

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    const userId = req.user._id.toString();
    const alreadyMarked = review.helpfulBy.some((id) => id.toString() === userId);

    if (alreadyMarked) {
        // Remove from helpful
        review.helpfulBy = review.helpfulBy.filter((id) => id.toString() !== userId);
        review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
        // Add to helpful
        review.helpfulBy.push(req.user._id);
        review.helpfulCount += 1;
    }

    await review.save();

    res.status(200).json({
        success: true,
        message: alreadyMarked ? 'Removed from helpful' : 'Marked as helpful',
        data: {
            helpfulCount: review.helpfulCount,
        },
    });
});
