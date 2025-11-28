import express from 'express';
import { getUsers, getUserDetail, updateUser, deleteUser, createUserAdmin } from '../controller/userController.js';
import { authenticate } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

router.use(authenticate);

router.get('/', isAdmin, getUsers);
router.get('/:id', isAdmin, getUserDetail);
router.put('/:id', isAdmin, upload.single('avatar'), uploadToCloudinary, updateUser);
router.post('/', isAdmin, createUserAdmin);
router.delete('/:id', isAdmin, deleteUser);

export default router;
