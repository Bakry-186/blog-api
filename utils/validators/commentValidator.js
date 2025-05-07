import { body, param } from "express-validator";
import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Post from "../../models/postModel.js";
import Comment from "../../models/commentModel.js";

// Create comment
export const createCommentValidator = [
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 3 })
    .withMessage("Comment must be at least 3 characters"),

  body("post")
    .notEmpty()
    .withMessage("Post ID is required")
    .isMongoId()
    .withMessage("Invalid post ID format")
    .custom(async (postId, { req }) => {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found!");

      if (!req.body.user) req.body.user = req.user._id;
      return true;
    }),

  // Optional if user is taken from req.user
  body("user").optional().isMongoId().withMessage("Invalid user ID"),

  validatorMiddleware,
];

// Delete 
export const deleteCommentValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid comment ID")
    .custom(async (id, { req }) => {
      const comment = await Comment.findById(id);
      if (!comment) throw new Error("Comment not found!");

      if (req.user.role !== "admin") {
        if (comment.user.toString() !== req.user._id.toString()) {
          throw new Error("You can't perfom this action!");
        }
      }

      return true;
    }),

  validatorMiddleware,
];

// Get by ID
export const getCommentValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid comment ID")
    .custom(async (id) => {
      const comment = await Comment.findById(id);
      if (!comment) throw new Error("Comment not found!");
      return true;
    }),

  validatorMiddleware,
];

// Update
export const updateCommentValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid comment ID")
    .custom(async (id, { req }) => {
      const comment = await Comment.findById(id);
      if (!comment) throw new Error("Comment not found!");

      if (comment.user.toString() !== req.user._id.toString()) {
        throw new Error("You can't perfom this action!");
      }

      return true;
    }),

  body("content")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Comment must be at least 3 characters"),

  validatorMiddleware,
];
