import { createSetor, getAllSetor, getSetorById, getSetorByUserId, updateSetor, deleteSetor } from '../models/setorModel.js';
import { getLokasiById } from '../models/lokasiModel.js';
import { getDetailsBySetorId } from '../models/detailSetorModel.js';
import { validateId, formatErrorResponse } from '../utils/validator.js';

export const createNewSetor = async (req, res) => {
  try {
    const user_id = req.user?.id || null;
    if (!user_id) return res.status(401).json(formatErrorResponse(['User tidak terautentikasi'], 'Unauthorized'));

    const { lokasi_id, catatan_tambahan } = req.body;

    if (lokasi_id) {
      const lok = await getLokasiById(lokasi_id);
      if (!lok) return res.status(400).json(formatErrorResponse([`Lokasi dengan ID ${lokasi_id} tidak ditemukan`], 'Lokasi tidak valid'));
    }

    const setor = await createSetor({ user_id, lokasi_id, catatan_tambahan });
    return res.status(201).json({ message: 'Setor berhasil dibuat', data: setor, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getSetorList = async (req, res) => {
  try {
    const rows = await getAllSetor();
    return res.json({ message: 'Daftar setor berhasil diambil', count: rows.length, data: rows, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getSetorDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'ID tidak valid'));

    const setor = await getSetorById(id);
    if (!setor) return res.status(404).json(formatErrorResponse([`Setor dengan ID ${id} tidak ditemukan`], 'Setor tidak ditemukan'));

    // access control: admin or owner
    if (req.user?.role !== 'admin' && req.user?.id !== Number(setor.user_id)) {
      return res.status(403).json(formatErrorResponse(['Anda tidak memiliki akses untuk melihat setor ini'], 'Forbidden'));
    }

    const details = await getDetailsBySetorId(id);
    return res.json({ message: 'Detail setor berhasil diambil', data: { ...setor, details }, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getSetorByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const idErrors = validateId(user_id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'User ID tidak valid'));

    // only admin or the user themselves can fetch
    if (req.user?.role !== 'admin' && req.user?.id !== Number(user_id)) {
      return res.status(403).json(formatErrorResponse(['Anda tidak memiliki akses untuk melihat data ini'], 'Forbidden'));
    }

    const rows = await getSetorByUserId(user_id);
    return res.json({ message: 'Daftar setor user berhasil diambil', count: rows.length, data: rows, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const updateSetorData = async (req, res) => {
  try {
    const { id } = req.params;
    const { lokasi_id, catatan_tambahan } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'ID tidak valid'));

    const setor = await updateSetor(id, { lokasi_id, catatan_tambahan });
    if (!setor) return res.status(404).json(formatErrorResponse([`Setor dengan ID ${id} tidak ditemukan`], 'Setor tidak ditemukan'));

    return res.json({ message: 'Setor berhasil diperbarui', data: setor, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const deleteSetorData = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'ID tidak valid'));

    const result = await deleteSetor(id);
    if (!result) return res.status(404).json(formatErrorResponse([`Setor dengan ID ${id} tidak ditemukan`], 'Setor tidak ditemukan'));

    return res.json({ message: 'Setor berhasil dihapus', data: { deletedId: result.id }, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export default { createNewSetor, getSetorList, getSetorDetail, getSetorByUser, updateSetorData, deleteSetorData };
