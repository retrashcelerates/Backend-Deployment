import express from 'express';
import { register, login, getProfile, updateProfile } from '../controller/authController.js';
import { authenticate } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, upload.single('avatar'), uploadToCloudinary, updateProfile);

export default router;
