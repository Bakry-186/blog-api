import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";

export const signupValidator = [
  check("name")
    .isString()
    .withMessage("User name must be a string.")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name must be between 2 and 32 characters.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name);
      return true;
    }),

  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required.")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exist.");
      }
    }),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct.");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required."),

  check("password")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  validatorMiddleware,
];

export const forgotPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required."),

  validatorMiddleware,
];

export const resetCodeValidator = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code is required")
    .isNumeric()
    .withMessage("Code must be numeric")
    .isLength({ min: 6, max: 6 })
    .withMessage("Code must be exactly 6 digits"),

  validatorMiddleware,
];

export const resetPasswordValidator = [
  check("email")
    .isEmail()
    .withMessage("Invalid email format.")
    .notEmpty()
    .withMessage("Email is required."),

  check("newPassword")
    .isString()
    .withMessage("Password must be a string.")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct!");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  validatorMiddleware,
];
