import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['customer', 'seller', 'admin'], 
        default: 'customer' 
    },
    companyName: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    yearEstablished: { type: Number },
    natureOfBusiness: { type: String, enum: ['Manufacturer', 'Wholesaler', 'Distributor', 'Retailer', 'Service Provider'], default: 'Wholesaler' },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    accountHolderName: { type: String },
    razorpayAccountId: { type: String }, // For Razorpay Route
    logoURL: { type: String }, // For Company Logo
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
