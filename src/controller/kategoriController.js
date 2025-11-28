import { getAllKategori, getKategoriById, createKategori, updateKategori, deleteKategori } from '../models/kategoriModel.js';

export const getKategoriList = async (req, res) => {
  try {
    const kategori = await getAllKategori();
    return res.json({ kategori });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getKategoriDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await getKategoriById(id);
    if (!kategori) return res.status(404).json({ message: 'Kategori not found' });
    return res.json({ kategori });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createNewKategori = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const kategori = await createKategori(name);
    return res.status(201).json({ kategori });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateKategoriData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const kategori = await updateKategori(id, name);
    if (!kategori) return res.status(404).json({ message: 'Kategori not found' });
    return res.json({ kategori });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteKategoriData = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteKategori(id);
    if (!result) return res.status(404).json({ message: 'Kategori not found' });
    return res.json({ message: 'Kategori deleted successfully', id: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default { getKategoriList, getKategoriDetail, createNewKategori, updateKategoriData, deleteKategoriData };
