import { body } from "express-validator";
import bcrypt from "bcrypt";

import validatorMiddleware from "../../middlewares/validatorMiddleware.js";
import User from "../../models/userModel.js";

export const updateProfileValidator = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long")
    .trim(),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  validatorMiddleware,
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom(async (password, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("User not found!");
      }

      // Verify current password
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password!");
      }

      // Verify password confirm
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation is not correct!");
      }
      return true;
    }),

  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirm is required."),

  validatorMiddleware,
];
