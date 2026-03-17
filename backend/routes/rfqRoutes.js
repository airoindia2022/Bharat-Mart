import express from 'express';
import { 
    createRFQ, 
    getRFQs, 
    getRFQById,
    updateRFQStatus
} from '../controllers/rfqController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createRFQ)
    .get(protect, getRFQs);

router.route('/:id')
    .get(protect, getRFQById)
    .put(protect, seller, updateRFQStatus);

export default router;
