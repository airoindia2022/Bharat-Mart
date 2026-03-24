import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: Transfer funds to seller
const transferToSeller = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate('seller');
        if (!order || order.status !== 'Paid' || order.isTransferredToSeller) return;

        const seller = order.seller;
        if (!seller.bankName || !seller.accountNumber || !seller.ifscCode) {
            console.log(`Seller ${seller._id} has not set up bank details. Skipping auto-transfer.`);
            return;
        }

        let razorpayAccountId = seller.razorpayAccountId;

        // If no Razorpay account ID, create a linked account
        if (!razorpayAccountId) {
            try {
                const account = await razorpay.accounts.create({
                    type: "standard",
                    email: seller.email,
                    profile: {
                        name: seller.name,
                        category: "manufacturing",
                        subcategory: "industrial_machinery",
                        addresses: {
                            registered: {
                                city: "Mumbai",
                                state: "Maharashtra",
                                street1: "Main St",
                                zip: "400001",
                                country: "IN"
                            }
                        }
                    },
                    legal_info: {
                        pan: "ABCDE1234F", // Mock PAN for demo
                        gst: "27ABCDE1234F1Z5" // Mock GST for demo
                    }
                });
                
                razorpayAccountId = account.id;
                seller.razorpayAccountId = razorpayAccountId;
                await seller.save();
            } catch (error) {
                console.error('Error creating Razorpay account:', error);
                // For demo purposes, we might just use a placeholder or log it
                // razorpayAccountId = 'acc_placeholder'; 
                return; 
            }
        }

        const sellerShare = order.amount * 0.90; // 90% to seller
        
        const transfer = await razorpay.transfers.create({
            account: razorpayAccountId,
            amount: sellerShare * 100, // in paise
            currency: "INR",
            notes: {
                order_id: order._id.toString(),
                product: order.product.toString()
            }
        });

        if (transfer) {
            order.isTransferredToSeller = true;
            order.razorpayTransferId = transfer.id;
            order.transferAmount = sellerShare;
            await order.save();
            console.log(`Auto-transferred ₹${sellerShare} to seller ${seller._id} for order ${order._id}`);
        }
    } catch (error) {
        console.error('Auto-transfer failed:', error);
    }
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { productId, amount, quantity, sellerId } = req.body;
        
        // Check stock availability
        const product = await Product.findById(productId);
        if (!product || product.countInStock < quantity) {
            return res.status(400).json({ success: false, message: 'Stock not available for this quantity' });
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Store the order in our database
        const order = await Order.create({
            buyer: req.user._id,
            product: productId,
            seller: sellerId,
            razorpayOrderId: razorpayOrder.id,
            amount,
            quantity,
            status: 'Pending',
        });

        res.status(200).json({
            success: true,
            order: razorpayOrder,
            dbOrderId: order._id
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment order' });
    }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify-payment
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is valid, update the order status
            const order = await Order.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { 
                    status: 'Paid', 
                    razorpayPaymentId: razorpay_payment_id 
                },
                { new: true }
            );

            // Decrease product stock
            if (order) {
                await Product.findByIdAndUpdate(
                    order.product,
                    { $inc: { countInStock: -order.quantity } }
                );

                // Auto transfer to seller
                await transferToSeller(order._id);
            }

            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// @desc    Get My Orders (as a buyer)
// @route   GET /api/payment/my-orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('product', 'name price images')
            .populate('seller', 'companyName')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// @desc    Get Seller Orders (as a seller)
// @route   GET /api/payment/seller-orders
// @access  Seller/Admin
export const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id })
            .populate('product', 'name price images')
            .populate('buyer', 'name email phoneNumber')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching seller orders' });
    }
};

// @desc    Get All Orders (as admin)
// @route   GET /api/payment/all-orders
// @access  Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('product', 'name price images')
            .populate('buyer', 'name email phoneNumber')
            .populate('seller', 'name companyName email')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders' });
    }
};
