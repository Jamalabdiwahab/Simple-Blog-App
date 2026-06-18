import { Router } from "express";
import { login, logout, refreshTokenController, register, updateProfilePic } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import upload from "../lib/multer.js";

const router = Router();

router.post("/register", register)
router.post("/login", login);
router.get("/refresh", refreshTokenController);
router.post("/logout", logout)
// Profile picture routes (protected)
router.put("/profile-pic", verifyToken, upload.single("profilePic"), updateProfilePic);
export default router;