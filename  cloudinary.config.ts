import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads/profile-images', // Define the folder name in Cloudinary
    format: async () => 'png', // File format
    public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique filename
  } as any,
});
export default cloudinary;