const express = require('express');
const { getRazorpayKey, createOrder, createCartOrder, verifyPayment, getMyOrders, getSellerOrders, getAllOrders, settleOrderManual, refundOrderManual, updateOrderStatus } = require('../controllers/paymentController.js');
const { protect, seller, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();
router.get('/get-key', protect, getRazorpayKey);

router.post('/create-order', protect, createOrder);
router.post('/create-cart-order', protect, createCartOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, seller, getSellerOrders);
router.get('/all-orders', protect, admin, getAllOrders);
router.put('/settle-order/:id', protect, admin, settleOrderManual);
router.put('/refund-order/:id', protect, admin, refundOrderManual);
router.put('/order/:id/status', protect, updateOrderStatus);

module.exports = router;
