import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import {
  createOne,
  getAll,
  getOne,
  deleteOne,
} from "../utils/factoryHandler.js";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import { createSendToken } from "../utils/generateTokens.js";

// @desc Get list of users
// @route GET /api/v1/users
// @access Private/Admin
export const getUsers = getAll(User);

// @desc Get specific user
// @route GET /api/v1/users
// @access Private/Admin
export const getUser = getOne(User);

// @desc Create
// @route POST /api/v1/users
// @access Private/Admin
export const createUser = createOne(User);

// @desc update specific user
// @route PUT /api/v1/users
// @access Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  res.status(200).json({ data: user });
});

// @desc Change password
// @route PUT /api/v1/users
// @access Private/Admin
export const changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 10),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found!", 404));
  }

  createSendToken(user, res);
});

// @desc Delete specific
// @route DELETE /api/v1/users
// @access Private/Admin
export const deleteUser = deleteOne(User);
