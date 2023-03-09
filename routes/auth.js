import express from "express";
import { registerUser, loginUser, logoutUser, refreshTokens } from "../controllers/auth.js";
import { uploadPicture } from "../middleware/uploadFile.js";

const router = express.Router();

/* POST */
router.post("/register", uploadPicture, registerUser);
router.post("/login", loginUser);

/* GET */
router.get("/logout", logoutUser);
router.get("/refresh", refreshTokens);

export default router;
