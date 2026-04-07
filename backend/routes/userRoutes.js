import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile,
    getUsers,
    uploadLogo,
    getUserPublicProfile
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.post('/logo', protect, upload.single('logo'), uploadLogo);
router.get('/:id', getUserPublicProfile);
router.get('/', protect, admin, getUsers);

export default router;
