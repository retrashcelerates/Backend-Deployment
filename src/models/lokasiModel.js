import pool from '../config/db.js';

export const getAllLokasi = async () => {
  const q = `SELECT id, name, jalan, desa, kecamatan, kabupaten, kodepos, created_at FROM lokasi ORDER BY id`;
  const { rows } = await pool.query(q);
  return rows;
};

export const getLokasiById = async (id) => {
  const q = `SELECT id, name, jalan, desa, kecamatan, kabupaten, kodepos, created_at FROM lokasi WHERE id=$1`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const createLokasi = async ({ name, jalan, desa = null, kecamatan = null, kabupaten = null, kodepos = null }) => {
  const q = `INSERT INTO lokasi (name, jalan, desa, kecamatan, kabupaten, kodepos) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, name, jalan, desa, kecamatan, kabupaten, kodepos, created_at`;
  const values = [name, jalan, desa, kecamatan, kabupaten, kodepos];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const updateLokasi = async (id, { name, jalan, desa = null, kecamatan = null, kabupaten = null, kodepos = null }) => {
  const q = `UPDATE lokasi SET name=$1, jalan=$2, desa=$3, kecamatan=$4, kabupaten=$5, kodepos=$6 WHERE id=$7 RETURNING id, name, jalan, desa, kecamatan, kabupaten, kodepos, created_at`;
  const values = [name, jalan, desa, kecamatan, kabupaten, kodepos, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const deleteLokasi = async (id) => {
  const q = `DELETE FROM lokasi WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};
