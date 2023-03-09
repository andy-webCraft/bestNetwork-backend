import express from "express";
import {
  createPost,
  addComment,
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost,
  deleteComment,
} from "../controllers/posts.js";
import { verifyAccessToken } from "../middleware/auth.js";
import { uploadPicture } from "../middleware/uploadFile.js";

const router = express.Router();

/* POST */
router.post("/", verifyAccessToken, uploadPicture, createPost);
router.post("/:postId/comments", verifyAccessToken, addComment);

/* GET */
router.get("/feed", verifyAccessToken, getFeedPosts);
router.get("/:userId/posts", verifyAccessToken, getUserPosts);

/* PATCH */
router.patch("/:postId/likes", verifyAccessToken, likePost);

/* DELETE */
router.delete("/:postId", verifyAccessToken, deletePost);
router.delete("/comment/:commentId", verifyAccessToken, deleteComment);

export default router;
