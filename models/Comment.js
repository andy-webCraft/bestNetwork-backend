import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    get: (value) => value.toString(),
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    get: (value) => value.toString(),
  },
  description: { type: String, required: true },
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
