import './env.js';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

console.log('Cloudinary Config Check:', { 
    cloud_name, 
    api_key: api_key ? '***' + api_key.slice(-4) : 'MISSING', 
    api_secret: api_secret ? 'PRESENT' : 'MISSING' 
});

if (!cloud_name || !api_key || !api_secret) {
    console.error('CRITICAL: Cloudinary credentials missing!');
}

cloudinary.config({
    cloud_name,
    api_key,
    api_secret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bharat-mart',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    },
});

export { cloudinary, storage };
