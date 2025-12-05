import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createNewRiwayatPenarikan,
  getRiwayatPenarikanList,
  getRiwayatPenarikanDetail,
  getRiwayatPenarikanByUser,
  updateRiwayatPenarikanData,
  deleteRiwayatPenarikanData,
} from "../controller/riwayatPenarikanController.js";

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }
  next();
};

router.post("/", authenticate, createNewRiwayatPenarikan);
router.get("/", authenticate, isAdmin, getRiwayatPenarikanList);
router.get("/user/:user_id", authenticate, getRiwayatPenarikanByUser);
router.get("/:id", authenticate, getRiwayatPenarikanDetail);
router.put("/:id", authenticate, isAdmin, updateRiwayatPenarikanData);
router.delete("/:id", authenticate, isAdmin, deleteRiwayatPenarikanData);

export default router;
