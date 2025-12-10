// src/controller/lokasiController.js
import {
  getAllLokasi,
  getLokasiById,
  createLokasi,
  updateLokasi,
  deleteLokasi,
} from '../models/lokasiModel.js';
import { validateId, formatErrorResponse } from '../utils/validator.js';

export const getLokasiList = async (req, res) => {
  try {
    const rows = await getAllLokasi();
    return res.json({
      message: 'Daftar lokasi berhasil diambil',
      count: rows.length,
      data: rows,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getLokasiDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'ID tidak valid'));
    }

    const lokasi = await getLokasiById(id);
    if (!lokasi) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Lokasi dengan ID ${id} tidak ditemukan`],
            'Lokasi tidak ditemukan'
          )
        );
    }

    return res.json({
      message: 'Detail lokasi berhasil diambil',
      data: lokasi,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const createNewLokasi = async (req, res) => {
  try {
    const { name, jalan, desa, kecamatan, kabupaten, kodepos } = req.body;

    if (!name || !jalan) {
      return res
        .status(400)
        .json(
          formatErrorResponse(
            ['Field `name` dan `jalan` wajib diisi'],
            'Data tidak lengkap'
          )
        );
    }

    // URL gambar dari Cloudinary middleware
    const image_url = req.fileUrl || null;

    const lokasi = await createLokasi({
      name,
      jalan,
      desa,
      kecamatan,
      kabupaten,
      kodepos,
      image_url,
    });

    return res.status(201).json({
      message: 'Lokasi berhasil dibuat',
      data: lokasi,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const updateLokasiData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, jalan, desa, kecamatan, kabupaten, kodepos } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'ID tidak valid'));
    }

    if (!name || !jalan) {
      return res
        .status(400)
        .json(
          formatErrorResponse(
            ['Field `name` dan `jalan` wajib diisi'],
            'Data tidak lengkap'
          )
        );
    }

    // URL gambar baru (kalau ada upload baru)
    const image_url = req.fileUrl || null;

    const lokasi = await updateLokasi(id, {
      name,
      jalan,
      desa,
      kecamatan,
      kabupaten,
      kodepos,
      image_url,
    });

    if (!lokasi) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Lokasi dengan ID ${id} tidak ditemukan`],
            'Lokasi tidak ditemukan'
          )
        );
    }

    return res.json({
      message: 'Lokasi berhasil diperbarui',
      data: lokasi,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const deleteLokasiData = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'ID tidak valid'));
    }

    const result = await deleteLokasi(id);
    if (!result) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Lokasi dengan ID ${id} tidak ditemukan`],
            'Lokasi tidak ditemukan'
          )
        );
    }

    return res.json({
      message: 'Lokasi berhasil dihapus',
      data: { deletedId: result.id },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export default {
  getLokasiList,
  getLokasiDetail,
  createNewLokasi,
  updateLokasiData,
  deleteLokasiData,
};
