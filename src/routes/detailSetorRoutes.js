import express from 'express';
import { addDetailToSetor, getDetailsForSetor, updateDetail, deleteDetail } from '../controller/detailSetorController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

router.post('/', authenticate, addDetailToSetor);
router.get('/setor/:setor_id', authenticate, getDetailsForSetor);
router.put('/:id', authenticate, isAdmin, updateDetail);
router.delete('/:id', authenticate, isAdmin, deleteDetail);

export default router;
