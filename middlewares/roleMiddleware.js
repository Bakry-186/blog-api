import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";

const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("Access denied!", 403));
    }

    next();
  });

export default authorizeRoles;
