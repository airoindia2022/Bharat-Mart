import express from 'express';
import { createOrder, verifyPayment, getMyOrders, getSellerOrders, getAllOrders } from '../controllers/paymentController.js';
import { protect, seller, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/seller-orders', protect, seller, getSellerOrders);
router.get('/all-orders', protect, admin, getAllOrders);

export default router;
