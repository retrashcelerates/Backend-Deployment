import express from 'express';
import { getLokasiList, getLokasiDetail, createNewLokasi, updateLokasiData, deleteLokasiData } from '../controller/lokasiController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

router.get('/', getLokasiList);
router.get('/:id', getLokasiDetail);

router.post('/', authenticate, isAdmin, createNewLokasi);
router.put('/:id', authenticate, isAdmin, updateLokasiData);
router.delete('/:id', authenticate, isAdmin, deleteLokasiData);

export default router;
