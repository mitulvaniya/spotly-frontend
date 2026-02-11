import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { uploadToCloudinary } from '../utils/upload';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user._id).populate('savedSpots');

    res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, phone, bio } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone, bio },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user,
        },
    });
});

// @desc    Upload/Update avatar
// @route   PUT /api/users/avatar
// @access  Private
export const uploadAvatar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
        throw new AppError('Please upload an image', 400);
    }

    const avatarUrl = await uploadToCloudinary(req.file, 'spotly/avatars');

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarUrl },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        data: {
            avatar: avatarUrl,
            user,
        },
    });
});

// @desc    Get saved spots
// @route   GET /api/users/saved
// @access  Private
export const getSavedSpots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user._id).populate({
        path: 'savedSpots',
        match: { isActive: true },
    });

    res.status(200).json({
        success: true,
        data: {
            savedSpots: user?.savedSpots || [],
        },
    });
});

// @desc    Save/Unsave spot
// @route   POST /api/users/saved/:spotId
// @access  Private
export const toggleSaveSpot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { spotId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const spotIndex = user.savedSpots.findIndex((id) => id.toString() === spotId);

    if (spotIndex > -1) {
        // Remove from saved
        user.savedSpots.splice(spotIndex, 1);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Spot removed from saved',
            data: {
                saved: false,
            },
        });
    } else {
        // Add to saved
        user.savedSpots.push(spotId as any);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Spot saved successfully',
            data: {
                saved: true,
            },
        });
    }
});
