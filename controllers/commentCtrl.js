import asyncHandler from "express-async-handler";
import {
  createOne,
  getAll,
  getOne,
  updateOne,
  deleteOne,
} from "../utils/factoryHandler.js";
import Comment from "../models/commentModel.js";
import ApiError from "../utils/apiError.js";

export const setPostIdToBody = (req, res, next) => {
  // Nested routes
  if (!req.body.post) req.body.post = req.params.postId;

  next();
};

export const createComment = createOne(Comment);
export const getComments = getAll(Comment);
export const getComment = getOne(Comment);
export const updateComment = updateOne(Comment);
export const deleteComment = deleteOne(Comment);

export const getMyComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ user: req.user._id });
  if (!comments) return next(new ApiError("No comments found!", 404));

  res.status(200).json({ data: comments });
});
