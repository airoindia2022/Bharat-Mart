const express = require('express');
const upload = require('../config/multer.js');
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile,
    getUsers,
    uploadLogo,
    getUserPublicProfile,
    toggleWishlist,
    getWishlist
} = require('../controllers/userController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.post('/logo', protect, upload.single('logo'), uploadLogo);
router.route('/wishlist')
    .get(protect, getWishlist)
    .post(protect, toggleWishlist);

router.get('/:id', getUserPublicProfile);
router.get('/', protect, admin, getUsers);

module.exports = router;
