import {
  createSetor,
  getAllSetor,
  getSetorById,
  getSetorByUserId,
  updateSetor,
  deleteSetor,
} from '../models/setorModel.js';
import { getLokasiById } from '../models/lokasiModel.js';
import { getProdukById } from '../models/produkModel.js';
import { validateId, formatErrorResponse } from '../utils/validator.js';

const withTotalHarga = (row) => {
  if (!row) return row;
  const harga = Number(row.harga_saat_transaksi || 0);
  const qty = Number(row.kuantitas || 0);
  return {
    ...row,
    total_harga: harga * qty,
  };
};

export const createNewSetor = async (req, res) => {
  try {
    const user_id = req.user?.id || null;
    if (!user_id) {
      return res
        .status(401)
        .json(formatErrorResponse(['User tidak terautentikasi'], 'Unauthorized'));
    }

    const {
      product_id,
      lokasi_id,
      kuantitas,
      catatan_tambahan,
      tanggal_setor,
    } = req.body;

    const errors = [];

    // Validasi product_id
    if (!product_id) {
      errors.push('product_id wajib diisi');
    } else {
      const idErrors = validateId(product_id);
      if (idErrors.length > 0) errors.push(...idErrors);
    }

    // Validasi lokasi (opsional, tapi kalau diisi harus valid)
    if (lokasi_id) {
      const idErrors = validateId(lokasi_id);
      if (idErrors.length > 0) errors.push(...idErrors);
    }

    // Validasi kuantitas
    const qtyNum = Number(kuantitas);
    if (!kuantitas && kuantitas !== 0) {
      errors.push('kuantitas wajib diisi');
    } else if (Number.isNaN(qtyNum) || qtyNum <= 0) {
      errors.push('kuantitas harus berupa angka lebih dari 0');
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(errors, 'Validasi data setor gagal'));
    }

    // Cek produk
    const produk = await getProdukById(product_id);
    if (!produk) {
      return res
        .status(400)
        .json(
          formatErrorResponse(
            [`Produk dengan ID ${product_id} tidak ditemukan`],
            'Produk tidak valid'
          )
        );
    }

    // Cek lokasi kalau ada
    if (lokasi_id) {
      const lok = await getLokasiById(lokasi_id);
      if (!lok) {
        return res
          .status(400)
          .json(
            formatErrorResponse(
              [`Lokasi dengan ID ${lokasi_id} tidak ditemukan`],
              'Lokasi tidak valid'
            )
          );
      }
    }

    // Harga per kg saat transaksi (dikunci dari tabel produk)
    const harga_saat_transaksi = Number(produk.harga);

    // Gambar (kalau kamu pakai Cloudinary + middleware uploadToCloudinary)
    const gambar_url = req.fileUrl || null;

    const setor = await createSetor({
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas: qtyNum,
      catatan_tambahan,
      tanggal_setor: tanggal_setor || null,
    });

    const setorWithTotal = withTotalHarga(setor);

    return res.status(201).json({
      message: 'Setor berhasil dibuat',
      data: setorWithTotal,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getSetorList = async (req, res) => {
  try {
    const rows = await getAllSetor();
    const data = rows.map(withTotalHarga);

    return res.json({
      message: 'Daftar setor berhasil diambil',
      count: data.length,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getSetorDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'ID tidak valid'));
    }

    const setor = await getSetorById(id);
    if (!setor) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Setor dengan ID ${id} tidak ditemukan`],
            'Setor tidak ditemukan'
          )
        );
    }

    // Hanya admin atau pemilik
    if (req.user?.role !== 'admin' && req.user?.id !== Number(setor.user_id)) {
      return res
        .status(403)
        .json(
          formatErrorResponse(
            ['Anda tidak memiliki akses untuk melihat setor ini'],
            'Forbidden'
          )
        );
    }

    const data = withTotalHarga(setor);

    return res.json({
      message: 'Detail setor berhasil diambil',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const getSetorByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const idErrors = validateId(user_id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'User ID tidak valid'));
    }

    // Hanya admin atau user itu sendiri
    if (req.user?.role !== 'admin' && req.user?.id !== Number(user_id)) {
      return res
        .status(403)
        .json(
          formatErrorResponse(
            ['Anda tidak memiliki akses untuk melihat data ini'],
            'Forbidden'
          )
        );
    }

    const rows = await getSetorByUserId(user_id);
    const data = rows.map(withTotalHarga);

    return res.json({
      message: 'Daftar setor user berhasil diambil',
      count: data.length,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const updateSetorData = async (req, res) => {
  try {
    const { id } = req.params;
    const { lokasi_id, catatan_tambahan, tanggal_setor } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'ID tidak valid'));
    }

    if (lokasi_id) {
      const idLokErrors = validateId(lokasi_id);
      if (idLokErrors.length > 0) {
        return res
          .status(400)
          .json(formatErrorResponse(idLokErrors, 'Lokasi ID tidak valid'));
      }
      const lok = await getLokasiById(lokasi_id);
      if (!lok) {
        return res
          .status(400)
          .json(
            formatErrorResponse(
              [`Lokasi dengan ID ${lokasi_id} tidak ditemukan`],
              'Lokasi tidak valid'
            )
          );
      }
    }

    const setor = await updateSetor(id, {
      lokasi_id,
      catatan_tambahan,
      tanggal_setor,
    });

    if (!setor) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Setor dengan ID ${id} tidak ditemukan`],
            'Setor tidak ditemukan'
          )
        );
    }

    const data = withTotalHarga(setor);

    return res.json({
      message: 'Setor berhasil diperbarui',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(formatErrorResponse(['Terjadi kesalahan pada server'], 'Server error'));
  }
};

export const deleteSetorData = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, 'ID tidak valid'));
    }

    const result = await deleteSetor(id);
    if (!result) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Setor dengan ID ${id} tidak ditemukan`],
            'Setor tidak ditemukan'
          )
        );
    }

    return res.json({
      message: 'Setor berhasil dihapus',
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
  createNewSetor,
  getSetorList,
  getSetorDetail,
  getSetorByUser,
  updateSetorData,
  deleteSetorData,
};
