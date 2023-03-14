import express from "express";
import { registerUser, loginUser, logoutUser, refreshTokens } from "../controllers/auth.js";
import { handleImageFile } from "../middleware/image.js";

const router = express.Router();

/* POST */
router.post("/register", handleImageFile, registerUser);
router.post("/login", loginUser);

/* GET */
router.get("/logout", logoutUser);
router.get("/refresh", refreshTokens);

export default router;
