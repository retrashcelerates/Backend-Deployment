import pool from '../config/db.js';

export const createSetor = async ({
  user_id,
  product_id,
  lokasi_id = null,
  gambar_url = null,
  harga_saat_transaksi,
  kuantitas,
  catatan_tambahan = null,
  tanggal_setor = null,
}) => {
  const q = `
    INSERT INTO setor (
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas,
      catatan_tambahan,
      tanggal_setor
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING
      id,
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas,
      catatan_tambahan,
      tanggal_setor
  `;

  const values = [
    user_id,
    product_id,
    lokasi_id,
    gambar_url,
    harga_saat_transaksi,
    kuantitas,
    catatan_tambahan,
    tanggal_setor,
  ];

  const { rows } = await pool.query(q, values);
  return rows[0];
};

// List semua setor
export const getAllSetor = async () => {
  const q = `
    SELECT
      id,
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas,
      catatan_tambahan,
      tanggal_setor
    FROM setor
    ORDER BY id
  `;
  const { rows } = await pool.query(q);
  return rows;
};

// Detail setor by ID
export const getSetorById = async (id) => {
  const q = `
    SELECT
      id,
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas,
      catatan_tambahan,
      tanggal_setor
    FROM setor
    WHERE id=$1
  `;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

// List setor milik user tertentu
export const getSetorByUserId = async (user_id) => {
  const q = `
    SELECT
      id,
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas,
      catatan_tambahan,
      tanggal_setor
    FROM setor
    WHERE user_id=$1
    ORDER BY id
  `;
  const { rows } = await pool.query(q, [user_id]);
  return rows;
};

// Update (sementara kita hanya izinkan ganti lokasi, catatan, tanggal)
export const updateSetor = async (
  id,
  { lokasi_id = null, catatan_tambahan = null, tanggal_setor = null }
) => {
  const q = `
    UPDATE setor
    SET
      lokasi_id = $1,
      catatan_tambahan = $2,
      tanggal_setor = $3
    WHERE id=$4
    RETURNING
      id,
      user_id,
      product_id,
      lokasi_id,
      gambar_url,
      harga_saat_transaksi,
      kuantitas,
      catatan_tambahan,
      tanggal_setor
  `;
  const values = [lokasi_id, catatan_tambahan, tanggal_setor, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

// Delete
export const deleteSetor = async (id) => {
  const q = `DELETE FROM setor WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export default {
  createSetor,
  getAllSetor,
  getSetorById,
  getSetorByUserId,
  updateSetor,
  deleteSetor,
};
