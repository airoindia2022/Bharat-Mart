const Order = require('../models/Order.js');
const User = require('../models/User.js');
const Product = require('../models/Product.js');

// @desc    Get Admin Stats
// @route   GET /api/stats/admin
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSellers = await User.countDocuments({ role: 'seller' });
        const totalProducts = await Product.countDocuments();
        
        const paidStatuses = ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
        const paidOrders = await Order.find({ status: { $in: paidStatuses } });
        const totalRevenue = paidOrders.reduce((acc, current) => acc + current.amount, 0);
        const totalProfit = totalRevenue * 0.10;

        // Last 6 months sales data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const salesByMonth = await Order.aggregate([
            { 
                $match: { 
                    status: { $in: ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'] },
                    createdAt: { $gte: sixMonthsAgo }
                } 
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    },
                    totalSales: { $sum: "$amount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Category distribution
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            totalUsers,
            totalSellers,
            totalProducts,
            totalOrders: paidOrders.length,
            totalRevenue,
            totalProfit,
            salesByMonth,
            categoryStats
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
};

// @desc    Get Seller Stats
// @route   GET /api/stats/seller
// @access  Private/Seller
exports.getSellerStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ seller: req.user._id });
        
        const paidStatuses = ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
        const sellerOrders = await Order.find({ seller: req.user._id, status: { $in: paidStatuses } });
        const totalRevenue = sellerOrders.reduce((acc, current) => acc + current.amount, 0);
        const netEarnings = totalRevenue * 0.90;

        // Last 6 months sales data
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const salesByMonth = await Order.aggregate([
            { 
                $match: { 
                    seller: req.user._id,
                    status: { $in: ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'] },
                    createdAt: { $gte: sixMonthsAgo }
                } 
            },
            {
                $group: {
                    _id: { 
                        year: { $year: "$createdAt" }, 
                        month: { $month: "$createdAt" } 
                    },
                    totalSales: { $sum: "$amount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Top products by sales
        const topProducts = await Order.aggregate([
            { 
                $match: { 
                    seller: req.user._id,
                    status: { $in: ['Paid', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'] }
                } 
            },
            {
                $group: {
                    _id: "$product",
                    totalQuantity: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$amount" }
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: "$productDetails" }
        ]);

        res.json({
            totalProducts,
            totalOrders: sellerOrders.length,
            totalRevenue,
            netEarnings,
            salesByMonth,
            topProducts
        });
    } catch (error) {
        console.error('Seller Stats Error:', error);
        res.status(500).json({ message: 'Error fetching seller stats' });
    }
};
