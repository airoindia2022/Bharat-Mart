import mongoose from 'mongoose';

const rfqSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'responded', 'closed'],
        default: 'pending'
    },
    sellerReply: { type: String, default: '' },
}, { timestamps: true });

const RFQ = mongoose.model('RFQ', rfqSchema);
export default RFQ;
