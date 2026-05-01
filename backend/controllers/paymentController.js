const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');

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
                console.error('Error creating Razorpay account (Check if Linked Accounts feature is enabled in your Razorpay dashboard):', error);
                // For demo purposes, we skip auto-transfer and allow manual settlement from Admin Panel
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

// @desc    Create Razorpay Order for specific product (Direct Buy)
// @route   POST /api/payment/create-order
// @access  Private
exports.createOrder = async (req, res) => {
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

// @desc    Create Razorpay Order for Cart
// @route   POST /api/payment/create-cart-order
// @access  Private
exports.createCartOrder = async (req, res) => {
    try {
        const { cartItems, totalAmount } = req.body;
        
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Validate stock for all items
        for (const item of cartItems) {
            const product = await Product.findById(item._id);
            if (!product || product.countInStock < item.quantity) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Stock not available for ${product ? product.name : 'Unknown Product'}` 
                });
            }
        }

        const options = {
            amount: totalAmount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_cart_${Date.now()}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Store multiple orders in our database, all linked to the same razorpayOrderId
        const orderPromises = cartItems.map(item => {
            return Order.create({
                buyer: req.user._id,
                product: item._id,
                seller: item.seller, // Assumes seller ID is present in the cart item
                razorpayOrderId: razorpayOrder.id,
                amount: item.price * item.quantity,
                quantity: item.quantity,
                status: 'Pending',
            });
        });

        await Promise.all(orderPromises);

        res.status(200).json({
            success: true,
            order: razorpayOrder
        });
    } catch (error) {
        console.error('Error creating Razorpay cart order:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment order' });
    }
};

// @desc    Verify Payment
// @route   POST /api/payment/verify-payment
// @access  Private
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is valid, update the order status for all entries linked to this Razorpay Order ID
            const orders = await Order.find({ razorpayOrderId: razorpay_order_id });
            
            if (orders && orders.length > 0) {
                // Update all orders state
                await Order.updateMany(
                    { razorpayOrderId: razorpay_order_id },
                    { 
                        status: 'Paid', 
                        razorpayPaymentId: razorpay_payment_id 
                    }
                );

                // Decrease product stock for each item
                for (const order of orders) {
                    await Product.findByIdAndUpdate(
                        order.product,
                        { $inc: { countInStock: -order.quantity } }
                    );
                }
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
exports.getMyOrders = async (req, res) => {
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
exports.getSellerOrders = async (req, res) => {
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
exports.getAllOrders = async (req, res) => {
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

// @desc    Settle Order Manually / Transfer Settlement (as admin)
// @route   PUT /api/payment/settle-order/:id
// @access  Admin
exports.settleOrderManual = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const paidStatuses = ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
        if (!paidStatuses.includes(order.status)) {
            return res.status(400).json({ message: 'Cannot settle an unpaid, cancelled, or already refunded order' });
        }

        if (order.isTransferredToSeller) {
            return res.status(400).json({ message: 'Order already settled' });
        }

        order.isTransferredToSeller = true;
        order.razorpayTransferId = 'MANUAL_SETTLEMENT_' + Date.now();
        order.transferAmount = order.amount * 0.90; // Defaulting to 90%
        
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Manual settlement failed:', error);
        res.status(500).json({ message: 'Error settling order manually' });
    }
};

// @desc    Refund Order Manually (as admin)
// @route   PUT /api/payment/refund-order/:id
// @access  Admin
exports.refundOrderManual = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const paidStatuses = ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
        if (!paidStatuses.includes(order.status)) {
            return res.status(400).json({ message: 'Only paid orders can be refunded' });
        }

        if (order.isTransferredToSeller) {
            return res.status(400).json({ message: 'Cannot refund an order already settled to the seller' });
        }

        // Trigger Razorpay Refund
        try {
            if (order.razorpayPaymentId) {
                await razorpay.payments.refund(order.razorpayPaymentId, {
                    amount: order.amount * 100 // in paise
                });
            }
        } catch (razorpayError) {
            console.error('Razorpay Refund API failed:', razorpayError);
            // We might still want to mark it as refunded in our DB if the admin is doing it manually
        }

        order.status = 'Refunded';
        
        // Restore stock
        await Product.findByIdAndUpdate(
            order.product,
            { $inc: { countInStock: order.quantity } }
        );

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Manual refund failed:', error);
        res.status(500).json({ message: 'Error refunding order manually' });
    }
};

// @desc    Update Order Status
// @route   PUT /api/payment/order/:id/status
// @access  Seller/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is seller of this product or admin
        if (order.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        order.status = status;
        
        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        } else if (status === 'Shipped') {
            order.shippedAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
};
