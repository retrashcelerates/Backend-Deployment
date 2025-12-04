import pool from "../config/db.js";

export const createRiwayatPenarikan = async ({
  user_id,
  jumlah_penarikan,
  tanggal_penarikan = null,
}) => {
  const q = `INSERT INTO riwayat_penarikan (user_id, jumlah_penarikan, tanggal_penarikan) VALUES ($1,$2,$3) RETURNING id, user_id, jumlah_penarikan, tanggal_penarikan`;
  const values = [user_id, jumlah_penarikan, tanggal_penarikan];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const getAllRiwayatPenarikan = async () => {
  const q = `SELECT id, user_id, jumlah_penarikan, tanggal_penarikan FROM riwayat_penarikan ORDER BY id`;
  const { rows } = await pool.query(q);
  return rows;
};

export const getRiwayatPenarikanById = async (id) => {
  const q = `SELECT id, user_id, jumlah_penarikan, tanggal_penarikan FROM riwayat_penarikan WHERE id=$1`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const getRiwayatPenarikanByUserId = async (user_id) => {
  const q = `SELECT id, user_id, jumlah_penarikan, tanggal_penarikan FROM riwayat_penarikan WHERE user_id=$1 ORDER BY id`;
  const { rows } = await pool.query(q, [user_id]);
  return rows;
};

export const updateRiwayatPenarikan = async (
  id,
  { jumlah_penarikan = null, tanggal_penarikan = null }
) => {
  const q = `UPDATE riwayat_penarikan SET jumlah_penarikan=$1, tanggal_penarikan=$2 WHERE id=$3 RETURNING id, user_id, jumlah_penarikan, tanggal_penarikan`;
  const values = [jumlah_penarikan, tanggal_penarikan, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const deleteRiwayatPenarikan = async (id) => {
  const q = `DELETE FROM riwayat_penarikan WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export default {
  createRiwayatPenarikan,
  getAllRiwayatPenarikan,
  getRiwayatPenarikanById,
  getRiwayatPenarikanByUserId,
  updateRiwayatPenarikan,
  deleteRiwayatPenarikan,
};
