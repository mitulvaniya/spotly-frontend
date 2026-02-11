import mongoose, { Document, Schema } from 'mongoose';

export interface IBusiness extends Document {
    owner: mongoose.Types.ObjectId;
    claimedSpots: mongoose.Types.ObjectId[];
    verificationStatus: 'pending' | 'verified' | 'rejected';
    verificationDocuments: string[];
    businessName: string;
    businessType: string;
    registrationNumber?: string;
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    planExpiry?: Date;
    analytics: {
        totalViews: number;
        totalReviews: number;
        averageRating: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Owner is required'],
            unique: true,
        },
        claimedSpots: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Spot',
            },
        ],
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        verificationDocuments: {
            type: [String],
            default: [],
        },
        businessName: {
            type: String,
            required: [true, 'Business name is required'],
            trim: true,
        },
        businessType: {
            type: String,
            required: [true, 'Business type is required'],
        },
        registrationNumber: {
            type: String,
            trim: true,
        },
        plan: {
            type: String,
            enum: ['free', 'basic', 'premium', 'enterprise'],
            default: 'free',
        },
        planExpiry: {
            type: Date,
        },
        analytics: {
            totalViews: {
                type: Number,
                default: 0,
            },
            totalReviews: {
                type: Number,
                default: 0,
            },
            averageRating: {
                type: Number,
                default: 0,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
BusinessSchema.index({ owner: 1 });
BusinessSchema.index({ verificationStatus: 1 });

export default mongoose.model<IBusiness>('Business', BusinessSchema);
