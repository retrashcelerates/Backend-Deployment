import { createDetailSetor, getDetailsBySetorId, getDetailById, updateDetailSetor, deleteDetailSetor } from '../models/detailSetorModel.js';
import { getSetorById } from '../models/setorModel.js';
import { validateId, formatErrorResponse } from '../utils/validator.js';

export const addDetailToSetor = async (req, res) => {
  try {
    const { setor_id } = req.body;
    const { product_id, kuantitas, harga_saat_transaksi } = req.body;

    const idErrors = validateId(setor_id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'Setor ID tidak valid'));

    // ensure setor exists
    const setor = await getSetorById(setor_id);
    if (!setor) return res.status(404).json(formatErrorResponse([`Setor dengan ID ${setor_id} tidak ditemukan`], 'Setor tidak ditemukan'));

    // basic numeric checks
    const qKuantitas = Number(kuantitas);
    const qHarga = Number(harga_saat_transaksi);
    const errors = [];
    if (isNaN(qKuantitas) || qKuantitas <= 0) errors.push('Kuantitas harus berupa angka lebih besar dari 0');
    if (isNaN(qHarga) || qHarga <= 0) errors.push('Harga saat transaksi harus berupa angka lebih besar dari 0');
    if (!product_id) errors.push('product_id harus diisi');
    if (errors.length > 0) return res.status(400).json(formatErrorResponse(errors, 'Data detail setor tidak valid'));

    const detail = await createDetailSetor({ setor_id, product_id, kuantitas: qKuantitas, harga_saat_transaksi: qHarga });
    return res.status(201).json({ message: 'Detail setor berhasil ditambahkan', data: detail, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getDetailsForSetor = async (req, res) => {
  try {
    const { setor_id } = req.params;
    const idErrors = validateId(setor_id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'Setor ID tidak valid'));

    const rows = await getDetailsBySetorId(setor_id);
    return res.json({ message: 'Detail setor berhasil diambil', count: rows.length, data: rows, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const updateDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_id, kuantitas, harga_saat_transaksi } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'ID tidak valid'));

    const qKuantitas = kuantitas !== undefined ? Number(kuantitas) : null;
    const qHarga = harga_saat_transaksi !== undefined ? Number(harga_saat_transaksi) : null;
    const errors = [];
    if (qKuantitas !== null && (isNaN(qKuantitas) || qKuantitas <= 0)) errors.push('Kuantitas harus berupa angka lebih besar dari 0');
    if (qHarga !== null && (isNaN(qHarga) || qHarga <= 0)) errors.push('Harga saat transaksi harus berupa angka lebih besar dari 0');
    if (errors.length > 0) return res.status(400).json(formatErrorResponse(errors, 'Data tidak valid'));

    const updated = await updateDetailSetor(id, { product_id, kuantitas: qKuantitas, harga_saat_transaksi: qHarga });
    if (!updated) return res.status(404).json(formatErrorResponse([`Detail dengan ID ${id} tidak ditemukan`], 'Detail tidak ditemukan'));

    return res.json({ message: 'Detail setor berhasil diperbarui', data: updated, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const deleteDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) return res.status(400).json(formatErrorResponse(idErrors, 'ID tidak valid'));

    const result = await deleteDetailSetor(id);
    if (!result) return res.status(404).json(formatErrorResponse([`Detail dengan ID ${id} tidak ditemukan`], 'Detail tidak ditemukan'));

    return res.json({ message: 'Detail setor berhasil dihapus', data: { deletedId: result.id }, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    return res.status(500).json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export default { addDetailToSetor, getDetailsForSetor, updateDetail, deleteDetail };
