// models/riwayatPenarikanModel.js
import pool from "../config/db.js";

export const createRiwayatPenarikan = async ({
  user_id,
  jumlah_penarikan,
  tanggal_penarikan = null,
  metode_penarikan,
  saldo_setelah,
  catatan = null,
  kode_transaksi,
}) => {
  const q = `
    INSERT INTO riwayat_penarikan (
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi
    )
    VALUES (
      $1,
      $2,
      COALESCE($3, NOW()),
      $4,
      $5,
      $6,
      $7
    )
    RETURNING
      id,
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi
  `;

  const values = [
    user_id,
    jumlah_penarikan,
    tanggal_penarikan,
    metode_penarikan,
    saldo_setelah,
    catatan,
    kode_transaksi,
  ];

  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const getAllRiwayatPenarikan = async () => {
  const q = `
    SELECT
      id,
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi
    FROM riwayat_penarikan
    ORDER BY id
  `;
  const { rows } = await pool.query(q);
  return rows;
};

export const getRiwayatPenarikanById = async (id) => {
  const q = `
    SELECT
      id,
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi
    FROM riwayat_penarikan
    WHERE id = $1
  `;
  const { rows } = await pool.query(q, [id]);
  return rows[0];
};

export const getRiwayatPenarikanByUserId = async (user_id) => {
  const q = `
    SELECT
      id,
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi
    FROM riwayat_penarikan
    WHERE user_id = $1
    ORDER BY id
  `;
  const { rows } = await pool.query(q, [user_id]);
  return rows;
};

// di sini aku buat update full field (kecuali kode_transaksi biasanya tidak diubah)
export const updateRiwayatPenarikan = async (
  id,
  {
    jumlah_penarikan = null,
    tanggal_penarikan = null,
    metode_penarikan = null,
    saldo_setelah = null,
    catatan = null,
  }
) => {
  const q = `
    UPDATE riwayat_penarikan
    SET
      jumlah_penarikan  = COALESCE($1, jumlah_penarikan),
      tanggal_penarikan = COALESCE($2, tanggal_penarikan),
      metode_penarikan  = COALESCE($3, metode_penarikan),
      saldo_setelah     = COALESCE($4, saldo_setelah),
      catatan           = COALESCE($5, catatan)
    WHERE id = $6
    RETURNING
      id,
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi
  `;
  const values = [
    jumlah_penarikan,
    tanggal_penarikan,
    metode_penarikan,
    saldo_setelah,
    catatan,
    id,
  ];
  const { rows } = await pool.query(q, values);
  return rows[0];
};

export const deleteRiwayatPenarikan = async (id) => {
  const q = `DELETE FROM riwayat_penarikan WHERE id = $1 RETURNING id`;
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
