import asyncHandler from "express-async-handler";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/factoryHandler.js";
import Post from "../models/postModel.js";
import ApiError from "../utils/apiError.js";

export const createPost = createOne(Post);
export const getPosts = getAll(Post);
export const getPost = getOne(Post);
export const updatePost = updateOne(Post);
export const deletePost = deleteOne(Post);

export const increaseViews = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ApiError("Post not found!", 404));

  post.views += 1;

  await post.save();

  next();
});

export const createLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ApiError("Post not found!", 404));

  const userId = req.user._id.toString();

  if (post.likes.includes(userId)) {
    return next(new ApiError("You already liked this post!", 400));
  }

  post.likes.push(userId);
  post.unLikes = post.unLikes.filter((id) => id.toString() !== userId);

  await post.save();
  res.status(200).json({ message: "Post liked." });
});

export const deleteLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ApiError("Post not found!", 404));

  const userId = req.user._id.toString();

  if (!post.likes.includes(userId)) {
    return next(new ApiError("You didn't like this post!", 400));
  }

  post.likes = post.likes.filter((id) => id.toString() !== userId);
  await post.save();
  res.status(200).json({ message: "Like removed." });
});

export const createUnLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ApiError("Post not found!", 404));

  const userId = req.user._id.toString();

  if (post.unLikes.includes(userId)) {
    return next(new ApiError("You already unliked this post!", 400));
  }

  post.unLikes.push(userId);
  post.likes = post.likes.filter((id) => id.toString() !== userId);

  await post.save();
  res.status(200).json({ message: "Post unliked." });
});

export const deleteUnLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ApiError("Post not found!", 404));

  const userId = req.user._id.toString();

  if (!post.unLikes.includes(userId)) {
    return next(new ApiError("You didn't unlike this post!", 400));
  }

  post.unLikes = post.unLikes.filter((id) => id.toString() !== userId);
  await post.save();
  res.status(200).json({ message: "Unlike removed." });
});
