// src/models/lokasiModel.js
import pool from '../config/db.js';

// Ambil semua lokasi AKTIF (untuk user / FE)
export const getAllLokasi = async () => {
  const q = `
    SELECT 
      id, 
      name, 
      jalan, 
      desa, 
      kecamatan, 
      kabupaten, 
      kodepos,
      image_url,
      is_active,
      created_at 
    FROM lokasi 
    WHERE is_active = TRUE
    ORDER BY id
  `;
  const { rows } = await pool.query(q);
  return rows;
};

// Ambil lokasi by ID (boleh aktif / nonaktif, misalnya untuk admin)
export const getLokasiById = async (id) => {
  const q = `
    SELECT 
      id, 
      name, 
      jalan, 
      desa, 
      kecamatan, 
      kabupaten, 
      kodepos,
      image_url,
      is_active,
      created_at 
    FROM lokasi 
    WHERE id = $1
  `;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

// Create lokasi baru
export const createLokasi = async ({
  name,
  jalan,
  desa = null,
  kecamatan = null,
  kabupaten = null,
  kodepos = null,
  image_url = null,
}) => {
  const q = `
    INSERT INTO lokasi (
      name, jalan, desa, kecamatan, kabupaten, kodepos, image_url
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING 
      id, 
      name, 
      jalan, 
      desa, 
      kecamatan, 
      kabupaten, 
      kodepos,
      image_url,
      is_active,
      created_at
  `;
  const values = [name, jalan, desa, kecamatan, kabupaten, kodepos, image_url];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

// Update lokasi (data + image_url)
export const updateLokasi = async (
  id,
  {
    name,
    jalan,
    desa = null,
    kecamatan = null,
    kabupaten = null,
    kodepos = null,
    image_url = null,
  }
) => {
  const q = `
    UPDATE lokasi
    SET 
      name = $1,
      jalan = $2,
      desa = $3,
      kecamatan = $4,
      kabupaten = $5,
      kodepos = $6,
      image_url = $7
    WHERE id = $8
    RETURNING 
      id, 
      name, 
      jalan, 
      desa, 
      kecamatan, 
      kabupaten, 
      kodepos,
      image_url,
      is_active,
      created_at
  `;
  const values = [name, jalan, desa, kecamatan, kabupaten, kodepos, image_url, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

// "Delete" lokasi → SOFT DELETE: is_active = FALSE
export const deleteLokasi = async (id) => {
  const q = `
    UPDATE lokasi
    SET is_active = FALSE
    WHERE id = $1
    RETURNING id
  `;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export default {
  getAllLokasi,
  getLokasiById,
  createLokasi,
  updateLokasi,
  deleteLokasi,
};
