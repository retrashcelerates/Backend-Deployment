import express from 'express';
import { createNewSetor, getSetorList, getSetorDetail, getSetorByUser, updateSetorData, deleteSetorData } from '../controller/setorController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

router.post('/', authenticate, createNewSetor);
router.get('/', authenticate, isAdmin, getSetorList);
router.get('/user/:user_id', authenticate, getSetorByUser);
router.get('/:id', authenticate, getSetorDetail);
router.put('/:id', authenticate, isAdmin, updateSetorData);
router.delete('/:id', authenticate, isAdmin, deleteSetorData);

export default router;
