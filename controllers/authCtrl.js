import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { createSendToken } from "../utils/generateTokens.js";

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
