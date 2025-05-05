import { body, param } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import Post from "../../models/postModel.js";

export const postIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid Post ID format")
    .custom(async (id) => {
      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found!");
      return true;
    }),

  validatorMiddleware,
];

export const createPostValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      if (!req.body.author) req.body.author = req.user._id;
      return true;
    }),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  body("author").optional().isMongoId().withMessage("Invalid author ID"),

  validatorMiddleware,
];

export const updatePostValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid post ID")
    .custom(async (id, { req }) => {
      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found!");

      if (req.user.role !== "admin") {
        if (post.author.toString() !== req.user._id.toString()) {
          throw new Error("You can't perfom this action!");
        }
      }

      return true;
    }),

  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .custom((title, { req }) => {
      req.body.slug = slugify(title);
      return true;
    }),

  body("content")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),

  validatorMiddleware,
];

export const deletePostValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid post ID")
    .custom(async (id, { req }) => {
      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found!");

      if (req.user.role !== "admin") {
        if (post.author.toString() !== req.user._id.toString()) {
          throw new Error("You can't perfom this action!");
        }
      }
      
      return true;
    }),

  validatorMiddleware,
];

export const getPostValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid post ID")
    .custom(async (id) => {
      const post = await Post.findById(id);
      if (!post) throw new Error("Post not found!");
      return true;
    }),

  validatorMiddleware,
];
