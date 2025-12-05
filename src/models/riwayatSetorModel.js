import pool from "../config/db.js";

export const createRiwayatSetor = async ({
  user_id,
  total_berat,
  total_harga,
  tanggal_setor = null,
}) => {
  const q = `INSERT INTO riwayat_setor (user_id, total_berat, total_harga, tanggal_setor) VALUES ($1,$2,$3,$4) RETURNING id, user_id, total_berat, total_harga, tanggal_setor`;
  const values = [user_id, total_berat, total_harga, tanggal_setor];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const getAllRiwayatSetor = async () => {
  const q = `SELECT id, user_id, total_berat, total_harga, tanggal_setor FROM riwayat_setor ORDER BY id`;
  const { rows } = await pool.query(q);
  return rows;
};

export const getRiwayatSetorById = async (id) => {
  const q = `SELECT id, user_id, total_berat, total_harga, tanggal_setor FROM riwayat_setor WHERE id=$1`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const getRiwayatSetorByUserId = async (user_id) => {
  const q = `SELECT id, user_id, total_berat, total_harga, tanggal_setor FROM riwayat_setor WHERE user_id=$1 ORDER BY id`;
  const { rows } = await pool.query(q, [user_id]);
  return rows;
};

export const updateRiwayatSetor = async (
  id,
  { total_berat = null, total_harga = null, tanggal_setor = null }
) => {
  const q = `UPDATE riwayat_setor SET total_berat=$1, total_harga=$2, tanggal_setor=$3 WHERE id=$4 RETURNING id, user_id, total_berat, total_harga, tanggal_setor`;
  const values = [total_berat, total_harga, tanggal_setor, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const deleteRiwayatSetor = async (id) => {
  const q = `DELETE FROM riwayat_setor WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export default {
  createRiwayatSetor,
  getAllRiwayatSetor,
  getRiwayatSetorById,
  getRiwayatSetorByUserId,
  updateRiwayatSetor,
  deleteRiwayatSetor,
};
