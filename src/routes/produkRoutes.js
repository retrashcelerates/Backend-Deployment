import express from 'express';
import { getProdukList, getProdukDetail, getProdukByKategori, createNewProduk, updateProdukData, deleteProdukData } from '../controller/produkController.js';
import { authenticate } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

router.get('/', getProdukList);
router.get('/:id', getProdukDetail);
router.get('/jenis/:kategori_id', getProdukByKategori);

router.post('/', authenticate, isAdmin, upload.single('image'), uploadToCloudinary, createNewProduk);
router.put('/:id', authenticate, isAdmin, upload.single('image'), uploadToCloudinary, updateProdukData);
router.delete('/:id', authenticate, isAdmin, deleteProdukData);

export default router;
