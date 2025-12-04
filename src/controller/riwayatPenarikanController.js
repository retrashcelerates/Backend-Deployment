import {
  createRiwayatPenarikan,
  getAllRiwayatPenarikan,
  getRiwayatPenarikanById,
  getRiwayatPenarikanByUserId,
  updateRiwayatPenarikan,
  deleteRiwayatPenarikan,
} from "../models/riwayatPenarikanModel.js";
import { validateId, formatErrorResponse } from "../utils/validator.js";

export const createNewRiwayatPenarikan = async (req, res) => {
  try {
    const user_id = req.user?.id || null;
    if (!user_id)
      return res
        .status(401)
        .json(
          formatErrorResponse(["User tidak terautentikasi"], "Unauthorized")
        );

    const { jumlah_penarikan, tanggal_penarikan } = req.body;
    const errors = [];
    if (jumlah_penarikan === undefined || jumlah_penarikan === null)
      errors.push("jumlah_penarikan harus diisi");
    if (errors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(errors, "Validasi gagal"));

    const created = await createRiwayatPenarikan({
      user_id,
      jumlah_penarikan,
      tanggal_penarikan,
    });
    return res
      .status(201)
      .json({
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
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));

    const row = await getRiwayatPenarikanById(id);
    if (!row)
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat penarikan dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );

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
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "User ID tidak valid"));

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
    const { jumlah_penarikan, tanggal_penarikan } = req.body;
    const idErrors = validateId(id);
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));

    const updated = await updateRiwayatPenarikan(id, {
      jumlah_penarikan,
      tanggal_penarikan,
    });
    if (!updated)
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat penarikan dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );

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
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));

    const result = await deleteRiwayatPenarikan(id);
    if (!result)
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat penarikan dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );

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
