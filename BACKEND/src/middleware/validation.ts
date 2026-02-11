import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const createSpotSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(2000).required(),
    category: Joi.string()
        .valid(
            'Food & Cafes',
            'Fashion & Clothing',
            'Local Services',
            'Health & Wellness',
            'Education & Training',
            'Real Estate',
            'Automotive',
            'Entertainment',
            'Events & Weddings'
        )
        .required(),
    subcategory: Joi.string().optional(),
    location: Joi.object({
        address: Joi.string().required(),
        city: Joi.string().required(),
        coordinates: Joi.object({
            type: Joi.string().valid('Point').default('Point'),
            coordinates: Joi.array().items(Joi.number()).length(2).required(),
        }).required(),
    }).required(),
    contact: Joi.object({
        phone: Joi.string().optional(),
        website: Joi.string().uri().optional(),
        email: Joi.string().email().optional(),
    }).optional(),
    priceRange: Joi.string().valid('$', '$$', '$$$', '$$$$').default('$$'),
    tags: Joi.array().items(Joi.string()).optional(),
    features: Joi.array().items(Joi.string()).optional(),
});

export const createReviewSchema = Joi.object({
    spot: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    text: Joi.string().min(10).max(1000).required(),
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional(),
    bio: Joi.string().max(500).optional(),
});

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
            });
            return;
        }

        // Replace req.body with validated value
        req.body = value;
        next();
    };
};
