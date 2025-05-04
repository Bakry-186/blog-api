import crypto from "crypto";

import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import sendEmail from "../utils/sendEmail.js";
import { createSendToken } from "../utils/generateTokens.js";
import { generateResetCode } from "../utils/generateResetCode.js";
import { resetPasswordEmail } from "../utils/emailTemplates.js";

// @desc Signup
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({ data: user });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }

  createSendToken(user, res);
});

// @desc Login
// @route POST /api/v1/auth/logout
// @access Private
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("Authorization").status(200).json({
    message: "Logged out successfully.",
  });
});

// @desc Forgot password
// @route POST /api/v1/auth/forgot-password
// @access Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  // if user exist, generate hash reset random 6 digit and save it in DB
  const { resetCode, hashedResetCode } = generateResetCode();

  // Store hashed reset code in DB
  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  //Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message: resetPasswordEmail(user.name, resetCode),
    });
  } catch (e) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is err in sending email.", 500));
  }

  res.status(200).json({ message: "Reset code sent to email." });
});

// @desc Verify reset password code
// @route POST /api/v1/auth/veify-reset-password
// @access Public
export const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  const resetCode = req.body.resetCode.toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or expired!"));
  }

  // Verify reset code
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ message: "Code verified, you may reset password" });
});

// @desc Reset password
// @route PUT /api/v1/auth/reset-password
// @access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified!", 400));
  }

  // Save new password in DB
  user.password = req.body.newPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  createSendToken(user, res);
});
