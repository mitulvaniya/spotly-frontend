import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { AppError } from '../middleware/errorHandler';

// Multer memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new AppError('Only image files are allowed', 400));
    }
};

// Multer upload configuration
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

// Upload to Cloudinary
export const uploadToCloudinary = async (
    file: Express.Multer.File,
    folder: string = 'spotly'
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(new AppError('Image upload failed', 500));
                } else {
                    resolve(result!.secure_url);
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

// Upload multiple images
export const uploadMultipleToCloudinary = async (
    files: Express.Multer.File[],
    folder: string = 'spotly'
): Promise<string[]> => {
    const uploadPromises = files.map((file) => uploadToCloudinary(file, folder));
    return Promise.all(uploadPromises);
};

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};
