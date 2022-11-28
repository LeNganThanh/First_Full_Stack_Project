import express from "express";
import { userValidation } from "../middleware/validateUser.middleWare.js";
import { adminValidation } from "../middleware/admin.middleware.js";
import { verifyToken } from "../middleware/verifyToken.middleWare.js";
import {
  getAllUsers,
  getLogin,
  getDeleteUser,
  getPostUser,
  getSingleUser,
  getUpdateUser,
  checkUserToken,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", verifyToken, adminValidation, getAllUsers);

//Route POST "/users/login"
router.post("/login", getLogin);

//check token user gives route
router.get("/checkusertoken", checkUserToken);

router.get("/:id", verifyToken, adminValidation, getSingleUser);
router.post("/", userValidation, getPostUser);
router.patch("/:id", verifyToken, adminValidation, getUpdateUser);
router.delete("/:id", verifyToken, adminValidation, getDeleteUser);

//***********IMPORTANT to export *******/
export default router;
