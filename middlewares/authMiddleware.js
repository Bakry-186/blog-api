import jwt from "jsonwebtoken";

import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  // Check if token exist
  const authHeader = req.headers.authorization || req.cookies?.Authorization;
  if (!authHeader) {
    return next(new ApiError("No access token!", 401));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ApiError("No access token!", 401));
  }

  // Verify token
  const decode = jwt.verify(token, process.env.JWT_SECRET_ACCESS_KEY);

  // Check if user exist
  const user = await User.findById(decode.userId);
  if (!user) {
    return next(new ApiError("User no longer exist!", 401));
  }

  req.user = user;
  next();
};

export default verifyToken;
