import pool from '../config/db.js';

export const createDetailSetor = async ({ setor_id, product_id, kuantitas, harga_saat_transaksi }) => {
  const q = `INSERT INTO detail_setor (setor_id, product_id, kuantitas, harga_saat_transaksi) VALUES ($1,$2,$3,$4) RETURNING id, setor_id, product_id, kuantitas, harga_saat_transaksi`;
  const values = [setor_id, product_id, kuantitas, harga_saat_transaksi];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const getDetailsBySetorId = async (setor_id) => {
  const q = `SELECT id, setor_id, product_id, kuantitas, harga_saat_transaksi FROM detail_setor WHERE setor_id=$1 ORDER BY id`;
  const { rows } = await pool.query(q, [setor_id]);
  return rows;
};

export const getDetailById = async (id) => {
  const q = `SELECT id, setor_id, product_id, kuantitas, harga_saat_transaksi FROM detail_setor WHERE id=$1`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const updateDetailSetor = async (id, { product_id = null, kuantitas = null, harga_saat_transaksi = null }) => {
  const q = `UPDATE detail_setor SET product_id=$1, kuantitas=$2, harga_saat_transaksi=$3 WHERE id=$4 RETURNING id, setor_id, product_id, kuantitas, harga_saat_transaksi`;
  const values = [product_id, kuantitas, harga_saat_transaksi, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const deleteDetailSetor = async (id) => {
  const q = `DELETE FROM detail_setor WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};
