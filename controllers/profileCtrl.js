import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import User from "../models/userModel.js";
import { createSendToken } from "../utils/generateTokens.js";

export const getMyProfile = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

export const updateMyProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );

  res.status(200).json({ data: user });
});

export const changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    password: await bcrypt.hash(req.body.password, 10),
    passwordChangedAt: Date.now(),
  });

  createSendToken(user, res);
});

export const deleteMyProfile = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({ message: "Profile deleted successfully." });
});
