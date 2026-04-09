import express from 'express';
import { createOrder, createCartOrder, verifyPayment, getMyOrders, getSellerOrders, getAllOrders, settleOrderManual, refundOrderManual, updateOrderStatus } from '../controllers/paymentController.js';
import { protect, seller, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/create-cart-order', protect, createCartOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, seller, getSellerOrders);
router.get('/all-orders', protect, admin, getAllOrders);
router.put('/settle-order/:id', protect, admin, settleOrderManual);
router.put('/refund-order/:id', protect, admin, refundOrderManual);
router.put('/order/:id/status', protect, updateOrderStatus);

export default router;
