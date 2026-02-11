import { Request, Response } from 'express';
import Spot from '../models/Spot';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '../utils/upload';

// @desc    Get all spots with filters
// @route   GET /api/spots
// @access  Public
export const getSpots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
        category,
        priceRange,
        minRating,
        search,
        city,
        page = 1,
        limit = 12,
        sort = '-createdAt',
    } = req.query;

    // Build query
    const query: any = { isActive: true, status: 'approved' };

    if (category) query.category = category;
    if (priceRange) query.priceRange = priceRange;
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (search) {
        query.$text = { $search: search as string };
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const spots = await Spot.find(query)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'name email');

    const total = await Spot.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            spots,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        },
    });
});

// @desc    Get single spot by ID
// @route   GET /api/spots/:id
// @access  Public
export const getSpot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const spot = await Spot.findById(req.params.id).populate('owner', 'name email avatar');

    if (!spot) {
        throw new AppError('Spot not found', 404);
    }

    // Increment view count
    spot.views += 1;
    await spot.save();

    res.status(200).json({
        success: true,
        data: {
            spot,
        },
    });
});

// @desc    Create new spot
// @route   POST /api/spots
// @access  Private (Business Owner/Admin)
export const createSpot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Handle image uploads
    let featuredImage = '';
    let images: string[] = [];

    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files.featuredImage && files.featuredImage[0]) {
            featuredImage = await uploadToCloudinary(files.featuredImage[0], 'spotly/spots');
        }

        if (files.images) {
            images = await uploadMultipleToCloudinary(files.images, 'spotly/spots');
        }
    }

    const spotData = {
        ...req.body,
        featuredImage,
        images,
        owner: req.user._id,
        status: req.user.role === 'admin' ? 'approved' : 'pending',
    };

    const spot = await Spot.create(spotData);

    res.status(201).json({
        success: true,
        message: 'Spot created successfully',
        data: {
            spot,
        },
    });
});

// @desc    Update spot
// @route   PUT /api/spots/:id
// @access  Private (Owner/Admin)
export const updateSpot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let spot = await Spot.findById(req.params.id);

    if (!spot) {
        throw new AppError('Spot not found', 404);
    }

    // Check ownership
    if (spot.owner?.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new AppError('Not authorized to update this spot', 403);
    }

    // Handle image uploads if provided
    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files.featuredImage && files.featuredImage[0]) {
            req.body.featuredImage = await uploadToCloudinary(files.featuredImage[0], 'spotly/spots');
        }

        if (files.images) {
            const newImages = await uploadMultipleToCloudinary(files.images, 'spotly/spots');
            req.body.images = [...(spot.images || []), ...newImages];
        }
    }

    spot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        message: 'Spot updated successfully',
        data: {
            spot,
        },
    });
});

// @desc    Delete spot
// @route   DELETE /api/spots/:id
// @access  Private (Admin only)
export const deleteSpot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const spot = await Spot.findById(req.params.id);

    if (!spot) {
        throw new AppError('Spot not found', 404);
    }

    await spot.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Spot deleted successfully',
    });
});

// @desc    Get nearby spots
// @route   GET /api/spots/nearby
// @access  Public
export const getNearbySpots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
        throw new AppError('Please provide longitude and latitude', 400);
    }

    const spots = await Spot.find({
        isActive: true,
        status: 'approved',
        'location.coordinates': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)],
                },
                $maxDistance: parseInt(maxDistance as string),
            },
        },
    }).limit(20);

    res.status(200).json({
        success: true,
        data: {
            spots,
        },
    });
});
