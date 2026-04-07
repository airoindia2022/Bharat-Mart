import express from 'express';
import { createOrder, verifyPayment, getMyOrders, getSellerOrders, getAllOrders, settleOrderManual, refundOrderManual } from '../controllers/paymentController.js';
import { protect, seller, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, seller, getSellerOrders);
router.get('/all-orders', protect, admin, getAllOrders);
router.put('/settle-order/:id', protect, admin, settleOrderManual);
router.put('/refund-order/:id', protect, admin, refundOrderManual);

export default router;
