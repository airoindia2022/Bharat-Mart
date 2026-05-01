const express = require('express');
const { getAdminStats, getSellerStats } = require('../controllers/statsController.js');
const { protect, admin, seller } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/admin', protect, admin, getAdminStats);
router.get('/seller', protect, seller, getSellerStats);

module.exports = router;
