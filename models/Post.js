import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      get: (value) => value.toString(),
    },
    description: String,
    picturePath: { type: String, default: "" },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          get: (value) => value.toString(),
        },
      ],
      default: [],
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", get: (value) => value.toString() },
    ],
  },
  {
    timestamps: true,
    methods: {
      getAuthor() {
        return this.populate("author", ["_id", "firstName", "lastName", "location", "picturePath"]);
      },
    },
    query: {
      byFeed(userId, friendsArr) {
        return this.find({ $or: [{ author: userId }, { author: friendsArr }] });
      },
      getSortPage(page, limit) {
        return this.skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: "desc" });
      },
      getAuthor() {
        return this.populate("author", ["_id", "firstName", "lastName", "location", "picturePath"]);
      },
      getComments() {
        return this.populate({
          path: "comments",
          populate: { path: "author", select: ["_id", "firstName", "lastName", "picturePath"] },
        });
      },
    },
  }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
