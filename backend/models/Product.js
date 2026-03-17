import mongoose from 'mongoose';

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
    minOrderQuantity: { type: Number, default: 1 },
    isApproved: { type: Boolean, default: false }, // Only admin can approve
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
