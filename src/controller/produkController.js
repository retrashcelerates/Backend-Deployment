import { getAllProduk, getProdukById, createProduk, updateProduk, deleteProduk } from '../models/produkModel.js';
import pool from '../config/db.js';

export const getProdukList = async (req, res) => {
  try {
    const produk = await getAllProduk();
    return res.json({ produk });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProdukDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const produk = await getProdukById(id);
    if (!produk) return res.status(404).json({ message: 'Produk not found' });
    return res.json({ produk });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getProdukByKategori = async (req, res) => {
  try {
    const { kategori_id } = req.params;
    const q = `SELECT id, nama_produk, harga, deskripsi, image_url, jenis FROM produk WHERE jenis = $1 ORDER BY id`;
    const { rows } = await pool.query(q, [kategori_id]);
    return res.json({ produk: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createNewProduk = async (req, res) => {
  try {
    const { nama_produk, harga, deskripsi, jenis } = req.body;
    if (!nama_produk || !harga) {
      return res.status(400).json({ message: 'nama_produk and harga are required' });
    }

    const image_url = req.fileUrl || null;
    const produk = await createProduk({ nama_produk, harga, deskripsi, image_url, jenis });
    return res.status(201).json({ produk });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProdukData = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, harga, deskripsi, jenis } = req.body;

    if (!nama_produk || !harga) {
      return res.status(400).json({ message: 'nama_produk and harga are required' });
    }

    const image_url = req.fileUrl || undefined;
    const produk = await updateProduk(id, { nama_produk, harga, deskripsi, image_url, jenis });
    if (!produk) return res.status(404).json({ message: 'Produk not found' });
    return res.json({ produk });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProdukData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProduk(id);
    if (!result) return res.status(404).json({ message: 'Produk not found' });
    return res.json({ message: 'Produk deleted successfully', id: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { getProdukList, getProdukDetail, getProdukByKategori, createNewProduk, updateProdukData, deleteProdukData };
