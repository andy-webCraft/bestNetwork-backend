import User from "../models/User.js";
import Post from "../models/Post.js";
import ApiError from "../services/error.js";
import { imageService } from "../services/image.js";

/* CREATE NEW POST */
export const createPost = async (req, res, next) => {
  try {
    const { userId } = req;
    const { description } = req.body;

    let picturePath = "";

    if (req.file) {
      picturePath = await imageService.uploadImage(req.file);
    }

    const newPost = new Post({
      author: userId,
      description,
      picturePath,
      likes: [],
      comments: [],
    });

    await newPost.save();
    await newPost.getAuthor();

    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

/* GET FEED POSTS */
export const getFeedPosts = async (req, res, next) => {
  try {
    const { userId } = req;
    const { page, limit = 10 } = req.query;

    const { friends } = await User.findById(userId);

    const posts = await Post.find()
      .byFeed(userId, friends)
      .getSortPage(page, limit)
      .getAuthor()
      .getComments();

    const count = await Post.find().byFeed(userId, friends).countDocuments();

    res.status(200).json({ posts, count });
  } catch (error) {
    next(error);
  }
};

/* GET USER POSTS */
export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit = 10 } = req.query;

    const posts = await Post.find({ author: userId })
      .getSortPage(page, limit)
      .getAuthor()
      .getComments();

    const count = await Post.find({ author: userId }).countDocuments();

    res.status(200).json({ posts, count });
  } catch (error) {
    next(error);
  }
};

/* UPDATE LIKES IN POST */
export const likePost = async (req, res, next) => {
  try {
    const { userId } = req;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    const likeIndex = post.likes.findIndex((id) => id === userId);

    if (likeIndex >= 0) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, { likes: post.likes }, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

/* ADD COMMENT IN POST */
export const addComment = async (req, res, next) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const { description } = req.body;

    const post = await Post.findById(postId);

    const newComment = new Comment({ postId, author: userId, description });
    await newComment.save();

    post.comments.push(newComment._id);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { comments: post.comments },
      { new: true }
    ).getComments();

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

/* DELETE COMMENT IN POST */
export const deleteComment = async (req, res, next) => {
  try {
    const { userId } = req;
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (comment.author !== userId) {
      return next(ApiError.accessDenied());
    }

    await comment.deleteOne();

    const updatedPost = await Post.findById(comment.postId).getComments();

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

/* DELETE POST */
export const deletePost = async (req, res, next) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (post.author !== userId) {
      return next(ApiError.accessDenied());
    }

    await post.deleteOne();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
