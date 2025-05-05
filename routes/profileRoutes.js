import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  deleteMyProfile,
} from "../controllers/profileCtrl.js";

import {
  updateProfileValidator,
  changePasswordValidator,
} from "../utils/validators/profileValidator.js";

import { getUser } from "../controllers/adminCtrl.js";

import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/get-my-profile", verifyToken, getMyProfile, getUser);

router.put(
  "/update-my-profile",
  verifyToken,
  updateProfileValidator,
  updateMyProfile
);
router.put(
  "/change-my-password",
  verifyToken,
  changePasswordValidator,
  changeMyPassword
);

router.delete("/delete-my-profile", verifyToken, deleteMyProfile);

export default router;
