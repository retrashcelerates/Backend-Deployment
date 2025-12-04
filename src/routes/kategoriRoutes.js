import express from 'express';
import { getKategoriList, getKategoriDetail, createNewKategori, updateKategoriData, deleteKategoriData } from '../controller/kategoriController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

router.get('/', getKategoriList);
router.get('/:id', getKategoriDetail);

router.post('/', authenticate, isAdmin, createNewKategori);
router.put('/:id', authenticate, isAdmin, updateKategoriData);
router.delete('/:id', authenticate, isAdmin, deleteKategoriData);

export default router;
