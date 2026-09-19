import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import publicRoutes from "./publicRoutes.js";

const router = express.Router();

// Public — no auth
router.use("/public", publicRoutes);

// Auth — register, login, refresh, me, logout, forgot-password
router.use("/auth", authRoutes);

// User — logged-in users only
router.use("/user", userRoutes);

// Admin — admins/investigators only
router.use("/admin", adminRoutes);

export default router;