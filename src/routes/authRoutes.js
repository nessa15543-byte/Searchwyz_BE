import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.post("/logout-all", protect, logoutAll);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;