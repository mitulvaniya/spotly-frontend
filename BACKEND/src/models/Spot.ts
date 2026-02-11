import mongoose, { Document, Schema } from 'mongoose';

export interface ISpot extends Document {
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    location: {
        address: string;
        city: string;
        coordinates: {
            type: string;
            coordinates: [number, number]; // [longitude, latitude]
        };
    };
    contact: {
        phone?: string;
        website?: string;
        email?: string;
    };
    hours?: {
        monday?: string;
        tuesday?: string;
        wednesday?: string;
        thursday?: string;
        friday?: string;
        saturday?: string;
        sunday?: string;
    };
    images: string[];
    featuredImage: string;
    rating: number;
    reviewCount: number;
    priceRange: '$' | '$$' | '$$$' | '$$$$';
    tags: string[];
    features: string[];
    owner?: mongoose.Types.ObjectId;
    isVerified: boolean;
    isActive: boolean;
    status: 'pending' | 'approved' | 'rejected';
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const SpotSchema = new Schema<ISpot>(
    {
        name: {
            type: String,
            required: [true, 'Spot name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            minlength: [10, 'Description must be at least 10 characters'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: [
                'Food & Cafes',
                'Fashion & Clothing',
                'Local Services',
                'Health & Wellness',
                'Education & Training',
                'Real Estate',
                'Automotive',
                'Entertainment',
                'Events & Weddings',
            ],
        },
        subcategory: {
            type: String,
            trim: true,
        },
        location: {
            address: {
                type: String,
                required: [true, 'Address is required'],
            },
            city: {
                type: String,
                required: [true, 'City is required'],
            },
            coordinates: {
                type: {
                    type: String,
                    enum: ['Point'],
                    default: 'Point',
                },
                coordinates: {
                    type: [Number],
                    required: true,
                    validate: {
                        validator: function (v: number[]) {
                            return v.length === 2;
                        },
                        message: 'Coordinates must be [longitude, latitude]',
                    },
                },
            },
        },
        contact: {
            phone: String,
            website: String,
            email: {
                type: String,
                match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
            },
        },
        hours: {
            monday: String,
            tuesday: String,
            wednesday: String,
            thursday: String,
            friday: String,
            saturday: String,
            sunday: String,
        },
        images: {
            type: [String],
            default: [],
        },
        featuredImage: {
            type: String,
            required: [true, 'Featured image is required'],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        priceRange: {
            type: String,
            enum: ['$', '$$', '$$$', '$$$$'],
            default: '$$',
        },
        tags: {
            type: [String],
            default: [],
        },
        features: {
            type: [String],
            default: [],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        views: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Create geospatial index for location-based queries
SpotSchema.index({ 'location.coordinates': '2dsphere' });
SpotSchema.index({ category: 1 });
SpotSchema.index({ rating: -1 });
SpotSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model<ISpot>('Spot', SpotSchema);
