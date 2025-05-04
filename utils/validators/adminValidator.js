import { param, body } from "express-validator";
import bcrypt from "bcrypt";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";

// Validator for Get User by ID
export const getUserValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),
  validatorMiddleware,
];

// Validator for Create User
export const createUserValidator = [
  body("name")
    .isString()
    .withMessage("User name must be a string.")
    .notEmpty()
    .withMessage("User name is required.")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name must be between 2 and 32 characters."),

  body("email")
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

  body("password")
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

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  body("role")
    .optional()
    .isIn(["user", "admin", "author"])
    .withMessage("Role must be either 'user' or 'admin' or 'author'."),

  validatorMiddleware,
];

// Validator for Update User
export const updateUserValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),

  body("name")
    .optional()
    .isString()
    .withMessage("User name must be a string.")
    .isLength({ min: 2, max: 32 })
    .withMessage("User name must be between 2 and 32 characters."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exist.");
      }
    }),

    body("role")
    .optional()
    .isIn(["user", "admin", "author"])
    .withMessage("Role must be either 'user' or 'admin' or 'author'."),

  validatorMiddleware,
];

// Validator for Change Password
export const changePasswordValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),

  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .custom(async (password, { req }) => {
      // Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found.");
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password.");
      }

      // Verify password confirm
      if (password !== req.body.passwordConfirm) {
        throw new Error("Incorrect confirmation password.");
      }
      return true;
    }),
  validatorMiddleware,
];

// Validator for Delete User
export const deleteUserValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid user ID format.")
    .notEmpty()
    .withMessage("User ID is required."),
  validatorMiddleware,
];

const adminValidator = {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
};

export default adminValidator;
