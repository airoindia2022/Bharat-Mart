const express = require('express');
const upload = require('../config/multer.js');
const { 
    createProduct, 
    getProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct,
    approveProduct,
    createProductReview
} = require('../controllers/productController.js');
const { protect, seller, admin, restoreUser } = require('../middleware/authMiddleware.js');

const router = express.Router();


router.route('/')
    .get(restoreUser, getProducts)
    .post(protect, seller, upload.array('images', 5), createProduct);

router.route('/:id')
    .get(restoreUser, getProductById)
    .put(protect, seller, upload.array('images', 5), updateProduct)
    .delete(protect, seller, deleteProduct);

router.post('/:id/reviews', protect, createProductReview);
router.put('/:id/approve', protect, admin, approveProduct);

module.exports = router;
