import { getAllProduk, getProdukById, createProduk, updateProduk, deleteProduk } from '../models/produkModel.js';
import {
  validateProductName,
  validatePrice,
  validateDescription,
  validateId,
  combineErrors,
  formatErrorResponse,
} from '../utils/validator.js';
import pool from '../config/db.js';

export const getProdukList = async (req, res) => {
  try {
    const produk = await getAllProduk();
    return res.json({
      message: 'Daftar produk berhasil diambil',
      count: produk.length,
      data: produk,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const getProdukDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Detail produk gagal: ID tidak valid'));
    }

    const produk = await getProdukById(id);
    if (!produk) {
      return res.status(404).json(
        formatErrorResponse([`Produk dengan ID ${id} tidak ditemukan di sistem`], 'Produk tidak ditemukan')
      );
    }
    return res.json({
      message: 'Detail produk berhasil diambil',
      data: produk,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const getProdukByKategori = async (req, res) => {
  try {
    const { kategori_id } = req.params;

    const kategoriErrors = validateId(kategori_id);
    if (kategoriErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(kategoriErrors, 'Produk kategori gagal: ID tidak valid'));
    }

    const q = `SELECT id, nama_produk, harga, deskripsi, image_url, jenis FROM produk WHERE jenis = $1 ORDER BY id`;
    const { rows } = await pool.query(q, [kategori_id]);
    
    if (rows.length === 0) {
      return res.status(404).json(
        formatErrorResponse([`Tidak ada produk dengan kategori ID ${kategori_id}`], 'Produk tidak ditemukan')
      );
    }

    return res.json({
      message: 'Produk berdasarkan kategori berhasil diambil',
      count: rows.length,
      data: rows,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const createNewProduk = async (req, res) => {
  try {
    const { nama_produk, harga, deskripsi, jenis } = req.body;

    const namaErrors = validateProductName(nama_produk);
    const hargaErrors = validatePrice(harga);
    const deskripsiErrors = validateDescription(deskripsi);

    const allErrors = combineErrors(namaErrors, hargaErrors, deskripsiErrors);

    if (allErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(allErrors, 'Buat produk gagal: Data tidak valid'));
    }

    const image_url = req.fileUrl || null;
    const produk = await createProduk({ nama_produk, harga, deskripsi, image_url, jenis });
    return res.status(201).json({
      message: 'Produk berhasil dibuat',
      data: produk,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const updateProdukData = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga, deskripsi, jenis } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Update produk gagal: ID tidak valid'));
    }

    const namaErrors = validateProductName(nama_produk);
    const hargaErrors = validatePrice(harga);
    const deskripsiErrors = validateDescription(deskripsi);

    const allErrors = combineErrors(namaErrors, hargaErrors, deskripsiErrors);

    if (allErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(allErrors, 'Update produk gagal: Data tidak valid'));
    }

    const image_url = req.fileUrl || undefined;
    const produk = await updateProduk(id, { nama_produk, harga, deskripsi, image_url, jenis });
    if (!produk) {
      return res.status(404).json(
        formatErrorResponse([`Produk dengan ID ${id} tidak ditemukan di sistem`], 'Produk tidak ditemukan')
      );
    }
    return res.json({
      message: 'Produk berhasil diperbarui',
      data: produk,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json(
      formatErrorResponse(['Terjadi kesalahan pada server, silakan coba lagi'], 'Server error')
    );
  }
};

export const deleteProdukData = async (req, res) => {
  try {
    const { id } = req.params;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res.status(400).json(formatErrorResponse(idErrors, 'Hapus produk gagal: ID tidak valid'));
    }

    const result = await deleteProduk(id);
    if (!result) {
      return res.status(404).json(
        formatErrorResponse([`Produk dengan ID ${id} tidak ditemukan di sistem`], 'Produk tidak ditemukan')
      );
    }
    return res.json({
      message: 'Produk berhasil dihapus',
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

export default { getProdukList, getProdukDetail, getProdukByKategori, createNewProduk, updateProdukData, deleteProdukData };
