import asyncHandler from "express-async-handler";
import {
  createOne,
  updateOne,
  deleteOne,
} from "../utils/factoryHandler.js";
import Post from "../models/postModel.js";
import ApiError from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import qs from "qs";

export const createPost = createOne(Post);
export const updatePost = updateOne(Post);
export const deletePost = deleteOne(Post);

export const getPosts = asyncHandler(async (req, res) => {
  let filterObject = {};
  if (req.filterObj) filterObject = req.filterObj;

  const countDocuments = await Post.countDocuments(filterObject);
  const apiFeatures = new ApiFeatures(
    Post.find(filterObject).populate("author", "name email"),
    qs.parse(req._parsedUrl.query)
  )
    .filter()
    .search("posts")
    .sort()
    .limitFields()
    .paginate(countDocuments);

  const { mongooseQuery, paginationResult } = apiFeatures;
  const docs = await mongooseQuery;

  res.status(200).json({ result: docs.length, paginationResult, data: docs });
});

export const getPost = asyncHandler(async (req, res, next) => {
  const doc = await Post.findById(req.params.id).populate(
    "author",
    "name email"
  );
  if (!doc) return next(new ApiError("Document not found!", 404));
  res.status(200).json({ data: doc });
});

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
