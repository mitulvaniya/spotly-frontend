import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { OAuth2Client } from 'google-auth-library';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('User with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        phone,
    });

    // Generate tokens
    const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: userResponse,
            accessToken,
            refreshToken,
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new AppError('Your account has been deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            user: userResponse,
            accessToken,
            refreshToken,
        },
    });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Generate new access token
    const accessToken = generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
    });

    res.status(200).json({
        success: true,
        data: {
            accessToken,
        },
    });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await User.findById(req.user._id).populate('savedSpots');

    res.status(200).json({
        success: true,
        data: {
            user,
        },
    });
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token. This endpoint is here for consistency.

    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new AppError('Google ID token is required', 400);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new AppError('Google OAuth is not configured on this server', 500);
    }

    const client = new OAuth2Client(clientId);

    // Verify the ID token with Google
    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientId,
        });
        payload = ticket.getPayload();
    } catch (error) {
        throw new AppError('Invalid Google ID token', 401);
    }

    if (!payload || !payload.email) {
        throw new AppError('Failed to get user info from Google', 401);
    }

    const { email, name, sub: googleId, picture } = payload;

    // Find existing user by email or googleId
    let user = await User.findOne({
        $or: [{ email }, { googleId }]
    });

    if (user) {
        // Update Google info if not already set
        if (!user.googleId) {
            user.googleId = googleId;
            user.provider = 'google';
        }
        if (picture && !user.avatar) {
            user.avatar = picture;
        }
        await user.save();
    } else {
        // Create new user from Google profile
        user = await User.create({
            name: name || email!.split('@')[0],
            email,
            googleId,
            provider: 'google',
            avatar: picture || '',
            isVerified: true, // Google emails are already verified
        });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    const refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });

    // Remove password from response
    const userResponse: any = user.toObject();
    delete userResponse.password;

    res.status(200).json({
        success: true,
        message: 'Google login successful',
        data: {
            user: userResponse,
            accessToken,
            refreshToken,
        },
    });
});
