import { Request, Response } from 'express';
import User from '../models/User';
import Spot from '../models/Spot';
import Review from '../models/Review';
import Business from '../models/Business';
import { asyncHandler } from '../middleware/errorHandler';

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 20, role, search } = req.query;

    const query: any = {};
    if (role) query.role = role;
    if (search) {
        query.$or = [
            { name: new RegExp(search as string, 'i') },
            { email: new RegExp(search as string, 'i') },
        ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});

// @desc    Get pending spot approvals
// @route   GET /api/admin/spots/pending
// @access  Private (Admin)
export const getPendingSpots = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const spots = await Spot.find({ status: 'pending' })
        .populate('owner', 'name email')
        .sort('-createdAt');

    res.status(200).json({
        success: true,
        data: {
            spots,
        },
    });
});

// @desc    Approve/Reject spot
// @route   PUT /api/admin/spots/:id/status
// @access  Private (Admin)
export const updateSpotStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { status } = req.body; // 'approved' or 'rejected'

    const spot = await Spot.findByIdAndUpdate(
        req.params.id,
        { status, isVerified: status === 'approved' },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: `Spot ${status} successfully`,
        data: {
            spot,
        },
    });
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
export const getAnalytics = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const totalUsers = await User.countDocuments();
    const totalSpots = await Spot.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalBusinesses = await Business.countDocuments();

    const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    const spotsByCategory = await Spot.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const recentUsers = await User.find()
        .select('-password')
        .sort('-createdAt')
        .limit(10);

    const topRatedSpots = await Spot.find({ isActive: true })
        .sort('-rating')
        .limit(10);

    res.status(200).json({
        success: true,
        data: {
            overview: {
                totalUsers,
                totalSpots,
                totalReviews,
                totalBusinesses,
            },
            usersByRole,
            spotsByCategory,
            recentUsers,
            topRatedSpots,
        },
    });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private (Admin)
export const toggleUserStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found',
        });
        return;
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
        success: true,
        message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
        data: {
            user,
        },
    });
});
