import express from "express";
import { changePassword, forgotPassword, userLogin, userRegister, verifyToken } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register" , userRegister);
router.post("/login", userLogin);
router.post("/forgot-password" , forgotPassword);
router.put("/change-password" , changePassword);
router.get("/verify-token" , verifyToken);

export default router;