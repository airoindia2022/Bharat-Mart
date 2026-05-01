const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }], // Cloudinary URLs
    price: { type: Number, required: true },
    packagingType: { type: String, default: 'Standard' },
    brand: { type: String, default: 'Generic' },
    deliveryTime: { type: String, default: '3-4 Days' },
    origin: { type: String, default: 'Made in India' },
    countInStock: { type: Number, default: 10 },
    isApproved: { type: Boolean, default: false }, // Only admin can approve
    specifications: [
        {
            key: { type: String, required: true },
            value: { type: String, required: true }
        }
    ],
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
        }
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
