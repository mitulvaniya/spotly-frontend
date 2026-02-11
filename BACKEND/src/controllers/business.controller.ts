import { Request, Response } from 'express';
import Business from '../models/Business';
import Spot from '../models/Spot';
import Review from '../models/Review';
import User from '../models/User';
import { asyncHandler, AppError } from '../middleware/errorHandler';

// @desc    Claim a business/spot
// @route   POST /api/business/claim/:spotId
// @access  Private (Business Owner)
export const claimBusiness = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { spotId } = req.params;
    const { businessName, businessType, registrationNumber } = req.body;

    // Check if spot exists
    const spot = await Spot.findById(spotId);
    if (!spot) {
        throw new AppError('Spot not found', 404);
    }

    // Check if spot is already claimed
    if (spot.owner) {
        throw new AppError('This spot is already claimed', 400);
    }

    // Update user role to business_owner if not already
    if (req.user.role === 'user') {
        await User.findByIdAndUpdate(req.user._id, { role: 'business_owner' });
    }

    // Create or update business profile
    let business = await Business.findOne({ owner: req.user._id });

    if (business) {
        business.claimedSpots.push(spotId as any);
        await business.save();
    } else {
        business = await Business.create({
            owner: req.user._id,
            claimedSpots: [spotId],
            businessName,
            businessType,
            registrationNumber,
        });
    }

    // Update spot owner
    spot.owner = req.user._id as any;
    spot.status = 'pending'; // Require admin approval
    await spot.save();

    res.status(200).json({
        success: true,
        message: 'Business claim request submitted. Awaiting admin approval.',
        data: {
            business,
            spot,
        },
    });
});

// @desc    Get business dashboard analytics
// @route   GET /api/business/dashboard
// @access  Private (Business Owner)
export const getDashboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const business = await Business.findOne({ owner: req.user._id }).populate('claimedSpots');

    if (!business) {
        throw new AppError('Business profile not found', 404);
    }

    // Get analytics for all claimed spots
    const spotIds = business.claimedSpots.map((spot: any) => spot._id);

    const totalViews = await Spot.aggregate([
        { $match: { _id: { $in: spotIds } } },
        { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    const totalReviews = await Review.countDocuments({ spot: { $in: spotIds } });

    const avgRating = await Review.aggregate([
        { $match: { spot: { $in: spotIds }, status: 'approved' } },
        { $group: { _id: null, average: { $avg: '$rating' } } },
    ]);

    // Update business analytics
    business.analytics = {
        totalViews: totalViews[0]?.total || 0,
        totalReviews,
        averageRating: avgRating[0]?.average || 0,
    };
    await business.save();

    res.status(200).json({
        success: true,
        data: {
            business,
            analytics: business.analytics,
        },
    });
});

// @desc    Get owned spots
// @route   GET /api/business/spots
// @access  Private (Business Owner)
export const getOwnedSpots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const spots = await Spot.find({ owner: req.user._id });

    res.status(200).json({
        success: true,
        data: {
            spots,
        },
    });
});
