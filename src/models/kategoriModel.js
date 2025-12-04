import pool from '../config/db.js';

export const getAllKategori = async () => {
  const q = `SELECT id, name FROM kategori ORDER BY id`;
  const { rows } = await pool.query(q);
  return rows;
};

export const getKategoriById = async (id) => {
  const q = `SELECT id, name FROM kategori WHERE id=$1`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const createKategori = async (name) => {
  const q = `INSERT INTO kategori (name) VALUES ($1) RETURNING id, name`;
  const { rows } = await pool.query(q, [name]);
  return rows[0];
};

export const updateKategori = async (id, name) => {
  const q = `UPDATE kategori SET name=$1 WHERE id=$2 RETURNING id, name`;
  const { rows } = await pool.query(q, [name, id]);
  return rows[0];
};

export const deleteKategori = async (id) => {
  const q = `DELETE FROM kategori WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};
