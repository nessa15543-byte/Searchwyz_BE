import jwt from "jsonwebtoken";
import crypto from "crypto";
import { CONFIG } from "../config/index.js";

export const generateAccessToken = (payload) =>
  jwt.sign(payload, CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn: CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  });

export const verifyRefreshToken = (token) =>
  jwt.verify(token, CONFIG.REFRESH_TOKEN_SECRET);

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// NEW: reset token for password reset
export const generateResetToken = (payload) =>
  jwt.sign(payload, CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: `${CONFIG.RESET_TOKEN_EXPIRES_MINUTES}m`,
  });

export const verifyResetToken = (token) =>
  jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET);