import {
  createRiwayatSetor,
  getAllRiwayatSetor,
  getRiwayatSetorById,
  getRiwayatSetorByUserId,
  updateRiwayatSetor,
  deleteRiwayatSetor,
} from "../models/riwayatSetorModel.js";
import { validateId, formatErrorResponse } from "../utils/validator.js";

export const createNewRiwayatSetor = async (req, res) => {
  try {
    const user_id = req.user?.id || null;
    if (!user_id)
      return res
        .status(401)
        .json(
          formatErrorResponse(["User tidak terautentikasi"], "Unauthorized")
        );

    const { total_berat, total_harga, tanggal_setor } = req.body;
    const errors = [];
    if (total_berat === undefined || total_berat === null)
      errors.push("total_berat harus diisi");
    if (total_harga === undefined || total_harga === null)
      errors.push("total_harga harus diisi");
    if (errors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(errors, "Validasi gagal"));

    const created = await createRiwayatSetor({
      user_id,
      total_berat,
      total_harga,
      tanggal_setor,
    });
    return res
      .status(201)
      .json({
        message: "Riwayat setor dibuat",
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

export const getRiwayatSetorList = async (req, res) => {
  try {
    const rows = await getAllRiwayatSetor();
    return res.json({
      message: "Daftar riwayat setor berhasil diambil",
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

export const getRiwayatSetorDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));

    const row = await getRiwayatSetorById(id);
    if (!row)
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat setor dengan ID ${id} tidak ditemukan`],
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
      message: "Riwayat setor berhasil diambil",
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

export const getRiwayatSetorByUser = async (req, res) => {
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

    const rows = await getRiwayatSetorByUserId(user_id);
    return res.json({
      message: "Daftar riwayat setor user berhasil diambil",
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

export const updateRiwayatSetorData = async (req, res) => {
  try {
    const { id } = req.params;
    const { total_berat, total_harga, tanggal_setor } = req.body;
    const idErrors = validateId(id);
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));

    const updated = await updateRiwayatSetor(id, {
      total_berat,
      total_harga,
      tanggal_setor,
    });
    if (!updated)
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat setor dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );

    return res.json({
      message: "Riwayat setor berhasil diperbarui",
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

export const deleteRiwayatSetorData = async (req, res) => {
  try {
    const { id } = req.params;
    const idErrors = validateId(id);
    if (idErrors.length > 0)
      return res
        .status(400)
        .json(formatErrorResponse(idErrors, "ID tidak valid"));

    const result = await deleteRiwayatSetor(id);
    if (!result)
      return res
        .status(404)
        .json(
          formatErrorResponse(
            [`Riwayat setor dengan ID ${id} tidak ditemukan`],
            "Tidak ditemukan"
          )
        );

    return res.json({
      message: "Riwayat setor berhasil dihapus",
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
  createNewRiwayatSetor,
  getRiwayatSetorList,
  getRiwayatSetorDetail,
  getRiwayatSetorByUser,
  updateRiwayatSetorData,
  deleteRiwayatSetorData,
};
