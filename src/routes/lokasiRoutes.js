// src/routes/lokasiRouter.js
import express from 'express';
import {
  getLokasiList,
  getLokasiDetail,
  createNewLokasi,
  updateLokasiData,
  deleteLokasiData,
} from '../controller/lokasiController.js';
import { authenticate } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// Public – list & detail
router.get('/', getLokasiList);
router.get('/:id', getLokasiDetail);

// Admin – create, update, delete lokasi + upload image
router.post(
  '/',
  authenticate,
  isAdmin,
  upload.single('image'),   
  uploadToCloudinary,
  createNewLokasi
);

router.put(
  '//:id',
  authenticate,
  isAdmin,
  upload.single('image'),   
  uploadToCloudinary,
  updateLokasiData
);

router.delete('/:id', authenticate, isAdmin, deleteLokasiData);

export default router;
