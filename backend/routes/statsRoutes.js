import express from 'express';
import { getAdminStats, getSellerStats } from '../controllers/statsController.js';
import { protect, admin, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, admin, getAdminStats);
router.get('/seller', protect, seller, getSellerStats);

export default router;
