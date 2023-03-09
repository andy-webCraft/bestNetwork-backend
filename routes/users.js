import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsersByName,
  updateUser,
} from "../controllers/users.js";
import { verifyAccessToken } from "../middleware/auth.js";
import { uploadPicture } from "../middleware/uploadFile.js";

const router = express.Router();

/* GET */
router.get("/search", verifyAccessToken, getUsersByName);
router.get("/:id", verifyAccessToken, getUser);
router.get("/:userId/friends", verifyAccessToken, getUserFriends);

/* POST */
router.post("/update", verifyAccessToken, uploadPicture, updateUser);

/* PATCH */
router.patch("/:userId/:friendId", verifyAccessToken, addRemoveFriend);

export default router;
