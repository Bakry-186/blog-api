import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../controllers/adminCtrl.js";

import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changePasswordValidator,
  deleteUserValidator,
} from "../utils/validators/adminValidator.js";

import verifyToken from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("admin"));

router.route("/").get(getUsers).post(createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put("/change-password/:id", changePasswordValidator, changePassword);

export default router;
