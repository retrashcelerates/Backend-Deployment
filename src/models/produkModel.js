import pool from '../config/db.js';

export const getAllProduk = async () => {
  const q = `SELECT id, nama_produk, harga, deskripsi, image_url, jenis FROM produk ORDER BY id`;
  const { rows } = await pool.query(q);
  return rows;
};

export const getProdukById = async (id) => {
  const q = `SELECT id, nama_produk, harga, deskripsi, image_url, jenis FROM produk WHERE id=$1`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const createProduk = async ({ nama_produk, harga, deskripsi = null, image_url = null, jenis = null }) => {
  const q = `INSERT INTO produk (nama_produk, harga, deskripsi, image_url, jenis) VALUES ($1,$2,$3,$4,$5) RETURNING id, nama_produk, harga, deskripsi, image_url, jenis`;
  const values = [nama_produk, harga, deskripsi, image_url, jenis];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const updateProduk = async (id, { nama_produk, harga, deskripsi, image_url, jenis }) => {
  const q = `UPDATE produk SET nama_produk=$1, harga=$2, deskripsi=$3, image_url=$4, jenis=$5 WHERE id=$6 RETURNING id, nama_produk, harga, deskripsi, image_url, jenis`;
  const values = [nama_produk, harga, deskripsi, image_url, jenis, id];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const deleteProduk = async (id) => {
  const q = `DELETE FROM produk WHERE id=$1 RETURNING id`;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};
