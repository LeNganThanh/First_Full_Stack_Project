import express from "express";
import {
  getAllOrders,
  getDeleteOrder,
  getPostOrder,
  getSingleOrder,
  getUpdateOrder,
} from "../controllers/order.controller.js";
import { adminValidation } from "../middleware/admin.middleware.js";
import { verifyToken } from "../middleware/verifyToken.middleWare.js";

const router = express.Router();

router.get("/", adminValidation, getAllOrders);
router.get("/:id", getSingleOrder);
router.post("/", getPostOrder);
router.patch("/:id", getUpdateOrder);
router.delete("/:id", getDeleteOrder);

export default router;
