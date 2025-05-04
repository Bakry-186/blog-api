import express from "express";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../controllers/adminCtrl.js";

const router = express.Router();

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.put("/change-password/:id", changePassword);

export default router;
