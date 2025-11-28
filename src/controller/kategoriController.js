import { getAllKategori, getKategoriById, createKategori, updateKategori, deleteKategori } from '../models/kategoriModel.js';
import { validateCategoryName, validateId, formatErrorResponse } from '../utils/validator.js';

export const getKategoriList = async (req, res) => {
  try {
    const kategori = await getAllKategori();
    return res.json({
      message: 'Daftar kategori berhasil diambil',
      count: kategori.length,
      data: kategori,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const getKategoriDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Detail kategori gagal: ID tidak valid'));
    }

    const kategori = await getKategoriById(id);
    if (!kategori) {
      return res.status(404).json(
        formatErrorResponse([`Kategori dengan ID ${id} tidak ditemukan di sistem`], 'Kategori tidak ditemukan')
      );
    }
    return res.json({
      message: 'Detail kategori berhasil diambil',
      data: kategori,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const createNewKategori = async (req, res) => {
  try {
    const { name } = req.body;

    const nameErrors = validateCategoryName(name);
    if (nameErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(nameErrors, 'Buat kategori gagal: Data tidak valid'));
    }

    const kategori = await createKategori(name);
    return res.status(201).json({
      message: 'Kategori berhasil dibuat',
      data: kategori,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const updateKategoriData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Update kategori gagal: ID tidak valid'));
    }

    const nameErrors = validateCategoryName(name);
    if (nameErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(nameErrors, 'Update kategori gagal: Data tidak valid'));
    }

    const kategori = await updateKategori(id, name);
    if (!kategori) {
      return res.status(404).json(
        formatErrorResponse([`Kategori dengan ID ${id} tidak ditemukan di sistem`], 'Kategori tidak ditemukan')
      );
    }
    return res.json({
      message: 'Kategori berhasil diperbarui',
      data: kategori,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const deleteKategoriData = async (req, res) => {
  try {
    const { id } = req.params;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Hapus kategori gagal: ID tidak valid'));
    }

    const result = await deleteKategori(id);
    if (!result) {
      return res.status(404).json(
        formatErrorResponse([`Kategori dengan ID ${id} tidak ditemukan di sistem`], 'Kategori tidak ditemukan')
      );
    }
    return res.json({
      message: 'Kategori berhasil dihapus',
      data: { deletedId: result.id },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export default { getKategoriList, getKategoriDetail, createNewKategori, updateKategoriData, deleteKategoriData };
