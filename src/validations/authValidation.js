import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10, "Refresh token required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(10, "Refresh token required"),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(10, "Reset token required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});