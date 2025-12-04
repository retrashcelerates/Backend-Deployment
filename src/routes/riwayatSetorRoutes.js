import express from "express";
import { authenticate } from "../middleware/auth.js";
import {
  createNewRiwayatSetor,
  getRiwayatSetorList,
  getRiwayatSetorDetail,
  getRiwayatSetorByUser,
  updateRiwayatSetorData,
  deleteRiwayatSetorData,
} from "../controller/riwayatSetorController.js";

const router = express.Router();

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin access required" });
  }
  next();
};

router.post("/", authenticate, createNewRiwayatSetor);
router.get("/", authenticate, isAdmin, getRiwayatSetorList);
router.get("/user/:user_id", authenticate, getRiwayatSetorByUser);
router.get("/:id", authenticate, getRiwayatSetorDetail);
router.put("/:id", authenticate, isAdmin, updateRiwayatSetorData);
router.delete("/:id", authenticate, isAdmin, deleteRiwayatSetorData);

export default router;
