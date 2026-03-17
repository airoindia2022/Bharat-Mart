import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    approveProduct
} from '../controllers/productController.js';
import { protect, seller, admin, restoreUser } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage });

router.route('/')
    .get(restoreUser, getProducts)
    .post(protect, seller, upload.array('images', 5), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, seller, upload.array('images', 5), updateProduct)
    .delete(protect, seller, deleteProduct);

router.put('/:id/approve', protect, admin, approveProduct);

export default router;
