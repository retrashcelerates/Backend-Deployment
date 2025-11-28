import { getAllBerita, getBeritaById, createBerita, updateBerita, deleteBerita } from '../models/beritaModel.js';
import pool from '../config/db.js';

export const getBeritaList = async (req, res) => {
  try {
    const berita = await getAllBerita();
    return res.json({ berita });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getBeritaDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const berita = await getBeritaById(id);
    if (!berita) return res.status(404).json({ message: 'Berita not found' });
    return res.json({ berita });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getBeritaByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatus = ['draft', 'published', 'archived'];
    
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be: draft, published, or archived' });
    }

    const q = `SELECT id, judul, konten, image_url, author, status, created_at FROM berita WHERE status=$1 ORDER BY created_at DESC`;
    const { rows } = await pool.query(q, [status]);
    return res.json({ berita: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createNewBerita = async (req, res) => {
  try {
    const { judul, konten, author, status } = req.body;
    if (!judul || !konten) {
      return res.status(400).json({ message: 'judul and konten are required' });
    }

    const image_url = req.fileUrl || null;
    const berita = await createBerita({ judul, konten, image_url, author, status });
    return res.status(201).json({ berita });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateBeritaData = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, konten, author, status } = req.body;

    if (!judul || !konten) {
      return res.status(400).json({ message: 'judul and konten are required' });
    }

    const image_url = req.fileUrl || undefined;
    const berita = await updateBerita(id, { judul, konten, image_url, author, status });
    if (!berita) return res.status(404).json({ message: 'Berita not found' });
    return res.json({ berita });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBeritaData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteBerita(id);
    if (!result) return res.status(404).json({ message: 'Berita not found' });
    return res.json({ message: 'Berita deleted successfully', id: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { getBeritaList, getBeritaDetail, getBeritaByStatus, createNewBerita, updateBeritaData, deleteBeritaData };
