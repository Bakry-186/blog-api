import express from "express";

import {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetCodeValidator,
  resetPasswordValidator,
} from "../utils/validators/authValidator.js";

import {
  signup,
  login,
  logout,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} from "../controllers/authCtrl.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/verify-reset-code", resetCodeValidator, verifyPassResetCode);

router.put("/reset-password", resetPasswordValidator, resetPassword);

export default router;
