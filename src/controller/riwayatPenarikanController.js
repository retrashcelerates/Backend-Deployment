// controller/riwayatPenarikanController.js
import {
  createRiwayatPenarikan,
  getAllRiwayatPenarikan,
  getRiwayatPenarikanById,
  getRiwayatPenarikanByUserId,
  updateRiwayatPenarikan,
  deleteRiwayatPenarikan,
} from "../models/riwayatPenarikanModel.js";
import { validateId, formatErrorResponse } from "../utils/validator.js";

// 🔹 Helper: generate kode_transaksi dari userId + timestamp
// Contoh hasil: WD-5-20251208125930
const generateKodeTransaksi = (userId, tanggal) => {
  const d = tanggal ? new Date(tanggal) : new Date();

  const yyyy = d.getFullYear().toString();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");

  return `WD-${userId}-${yyyy}${mm}${dd}${hh}${mi}${ss}`;
};

export const createNewRiwayatPenarikan = async (req, res) => {
  try {
    const user_id = req.user?.id || null;
    if (!user_id) {
      return res
        .status(401)
        .json(
          formatErrorResponse(["User tidak terautentikasi"], "Unauthorized")
        );
    }

    const {
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
    } = req.body;

    const errors = [];

    // Validasi jumlah_penarikan
    if (jumlah_penarikan === undefined || jumlah_penarikan === null) {
      errors.push("jumlah_penarikan harus diisi");
    } else if (Number(jumlah_penarikan) <= 0) {
      errors.push("jumlah_penarikan harus lebih besar dari 0");
    }

    // Validasi metode_penarikan
    if (!metode_penarikan) {
      errors.push("metode_penarikan harus diisi");
    }

    // Validasi saldo_setelah
    if (saldo_setelah === undefined || saldo_setelah === null) {
      errors.push("saldo_setelah harus diisi");
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(errors, "Validasi gagal"));
    }

    // 🔹 Generate kode_transaksi dari user_id + tanggal (atau now)
    const kode_transaksi = generateKodeTransaksi(user_id, tanggal_penarikan);

    const created = await createRiwayatPenarikan({
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
      kode_transaksi,
    });

    return res.status(201).json({
      message: "Riwayat penarikan dibuat",
      data: created,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        formatErrorResponse(["Terjadi kesalahan pada server"], "Server error")
      );
  }
};

export const getRiwayatPenarikanList = async (req, res) => {
  try {
    const rows = await getAllRiwayatPenarikan();
    return res.json({
      message: "Daftar riwayat penarikan berhasil diambil",
      count: rows.length,
      data: rows,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        formatErrorResponse(["Terjadi kesalahan pada server"], "Server error")
      );
  }
};

export const getRiwayatPenarikanDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));
    }

    const row = await getRiwayatPenarikanById(id);
    if (!row) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat penarikan dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );
    }

    // Hanya admin atau pemilik riwayat yang boleh lihat
    if (req.user?.role !== "admin" && req.user?.id !== Number(row.user_id)) {
      return res
        .status(403)
        .json(
          formatErrorResponse(
            ["Anda tidak memiliki akses untuk melihat riwayat ini"],
            "Forbidden"
          )
        );
    }

    return res.json({
      message: "Riwayat penarikan berhasil diambil",
      data: row,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        formatErrorResponse(["Terjadi kesalahan pada server"], "Server error")
      );
  }
};

export const getRiwayatPenarikanByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const idErrors = validateId(user_id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "User ID tidak valid"));
    }

    // Hanya admin atau user itu sendiri yang boleh akses
    if (req.user?.role !== "admin" && req.user?.id !== Number(user_id)) {
      return res
        .status(403)
        .json(
          formatErrorResponse(
            ["Anda tidak memiliki akses untuk melihat data ini"],
            "Forbidden"
          )
        );
    }

    const rows = await getRiwayatPenarikanByUserId(user_id);
    return res.json({
      message: "Daftar riwayat penarikan user berhasil diambil",
      count: rows.length,
      data: rows,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        formatErrorResponse(["Terjadi kesalahan pada server"], "Server error")
      );
  }
};

export const updateRiwayatPenarikanData = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
    } = req.body;

    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));
    }

    const updated = await updateRiwayatPenarikan(id, {
      jumlah_penarikan,
      tanggal_penarikan,
      metode_penarikan,
      saldo_setelah,
      catatan,
    });

    if (!updated) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat penarikan dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );
    }

    return res.json({
      message: "Riwayat penarikan berhasil diperbarui",
      data: updated,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        formatErrorResponse(["Terjadi kesalahan pada server"], "Server error")
      );
  }
};

export const deleteRiwayatPenarikanData = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0) {
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));
    }

    const result = await deleteRiwayatPenarikan(id);
    if (!result) {
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat penarikan dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );
    }

    return res.json({
      message: "Riwayat penarikan berhasil dihapus",
      data: { deletedId: result.id },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(
        formatErrorResponse(["Terjadi kesalahan pada server"], "Server error")
      );
  }
};

export default {
  createNewRiwayatPenarikan,
  getRiwayatPenarikanList,
  getRiwayatPenarikanDetail,
  getRiwayatPenarikanByUser,
  updateRiwayatPenarikanData,
  deleteRiwayatPenarikanData,
};
