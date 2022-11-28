import express from "express";
import {
  getAllRecords,
  getDeleteRecord,
  getPostRecord,
  getSingleRecord,
  getUpdateRecord,
} from "../controllers/record.controller.js";
import { adminValidation } from "../middleware/admin.middleware.js";
import { verifyToken } from "../middleware/verifyToken.middleWare.js";

const router = express.Router();

router.get("/", getAllRecords);
router.get("/:id", getSingleRecord);
router.post("/", verifyToken, adminValidation, getPostRecord);
router.patch("/:id", verifyToken, adminValidation, getUpdateRecord);
router.delete("/:id", verifyToken, adminValidation, getDeleteRecord);

export default router;
