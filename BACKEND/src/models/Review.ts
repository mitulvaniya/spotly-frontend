import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    spot: mongoose.Types.ObjectId;
    rating: number;
    text: string;
    images: string[];
    helpfulCount: number;
    helpfulBy: mongoose.Types.ObjectId[];
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        spot: {
            type: Schema.Types.ObjectId,
            ref: 'Spot',
            required: [true, 'Spot is required'],
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5'],
        },
        text: {
            type: String,
            required: [true, 'Review text is required'],
            minlength: [10, 'Review must be at least 10 characters'],
            maxlength: [1000, 'Review cannot exceed 1000 characters'],
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 5;
                },
                message: 'Cannot upload more than 5 images',
            },
        },
        helpfulCount: {
            type: Number,
            default: 0,
        },
        helpfulBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved', // Auto-approve for now, can be changed to 'pending'
        },
    },
    {
        timestamps: true,
    }
);

// Ensure one review per user per spot
ReviewSchema.index({ user: 1, spot: 1 }, { unique: true });
ReviewSchema.index({ spot: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1 });

// Update spot rating when review is saved
ReviewSchema.post('save', async function () {
    const Review = mongoose.model('Review');
    const Spot = mongoose.model('Spot');

    const reviews = await Review.find({ spot: this.spot, status: 'approved' });
    const avgRating = reviews.reduce((acc, rev: any) => acc + rev.rating, 0) / reviews.length;

    await Spot.findByIdAndUpdate(this.spot, {
        rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
        reviewCount: reviews.length,
    });
});

// Update spot rating when review is deleted
ReviewSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const Review = mongoose.model('Review');
        const Spot = mongoose.model('Spot');

        const reviews = await Review.find({ spot: doc.spot, status: 'approved' });
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / reviews.length
            : 0;

        await Spot.findByIdAndUpdate(doc.spot, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
        });
    }
});

export default mongoose.model<IReview>('Review', ReviewSchema);
