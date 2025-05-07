import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deleteMyProfile,
} from "../controllers/profileCtrl.js";

import { getComments } from "../controllers/commentCtrl.js";
import { getPosts } from "../controllers/postCtrl.js";

import {
  updateProfileValidator,
  changePasswordValidator,
} from "../utils/validators/profileValidator.js";

import { getUser } from "../controllers/adminCtrl.js";

import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import createFilterObj from "../middlewares/filterMiddleware.js";

const router = express.Router();

router
  .route("/me")
  .get(verifyToken, getMyProfile, getUser)
  .put(verifyToken, updateProfileValidator, updateMyProfile)
  .delete(verifyToken, deleteMyProfile);

router.put(
  "/change-password",
  verifyToken,
  changePasswordValidator,
  changeMyPassword
);

router.get(
  "/me/posts",
  verifyToken,
  authorizeRoles("author"),
  createFilterObj({ authorField: true }),
  getPosts
);

router.get(
  "/me/comments",
  verifyToken,
  createFilterObj({ userField: true }),
  getComments
);

export default router;
