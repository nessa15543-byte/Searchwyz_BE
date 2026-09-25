import User from "../models/User.js";
import Admin from "../models/Admin.js";
import logger from "../logger/index.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateResetToken,
  verifyResetToken,
} from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/sendEmail.js";
import { CONFIG } from "../config/index.js";
import { computeLocationRanking } from "../utils/ranking.js";

// ---------- helpers ----------

const buildAuthPayload = (entity, role) => {
  const accessToken = generateAccessToken({ id: entity._id, role });
  const refreshToken = generateRefreshToken({ id: entity._id, role });
  return { accessToken, refreshToken, role };
};

const cookieOptions = (maxAgeMinutes) => ({
  httpOnly: true,
  secure: CONFIG.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: maxAgeMinutes * 60 * 1000,
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  const accessMinutes =
    Number(String(CONFIG.ACCESS_TOKEN_EXPIRES_IN).replace("m", "")) || 2;
  const refreshMinutes = Number(CONFIG.REFRESH_TOKEN_EXPIRES_MINUTES) || 3;

  res.cookie("accessToken", accessToken, cookieOptions(accessMinutes));
  res.cookie("refreshToken", refreshToken, cookieOptions(refreshMinutes));
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
};

const saveRefreshToken = async (entity, refreshToken, req) => {
  const minutes = Number(CONFIG.REFRESH_TOKEN_EXPIRES_MINUTES);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new Error("REFRESH_TOKEN_EXPIRES_MINUTES is not configured correctly");
  }

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

  entity.refreshTokens.push({
    tokenHash,
    userAgent: req.headers["user-agent"] || null,
    ipAddress: req.ip || null,
    expiresAt,
  });

  await entity.save();
};

const pruneExpiredRefreshTokens = (entity) => {
  if (!entity.refreshTokens) return;
  const now = new Date();
  entity.refreshTokens = entity.refreshTokens.filter(
    (rt) => rt.expiresAt > now
  );
};

const hasActiveRefreshToken = (entity) => {
  if (!entity.refreshTokens || entity.refreshTokens.length === 0) return false;
  const now = new Date();
  return entity.refreshTokens.some((rt) => rt.expiresAt > now);
};

// ---------- register ----------

export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.validated;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    }

    await User.create({ fullName, email, phone, password });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "register",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- login ----------

export const login = async (req, res) => {
  try {
    const { email, password } = req.validated;

    // check admin first
    const admin = await Admin.findOne({ email }).select(
      "+password +refreshTokens"
    );
    if (admin && (await admin.matchPassword(password))) {
      pruneExpiredRefreshTokens(admin);

      if (hasActiveRefreshToken(admin)) {
        return res.status(409).json({
          success: false,
          message:
            "Admin already logged in. Log out first or wait for refresh to expire.",
        });
      }

      const tokens = buildAuthPayload(admin, admin.role);
      await saveRefreshToken(admin, tokens.refreshToken, req);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      logger.info({
        message: `Admin login: ${email}`,
        route: "login",
        service: "auth",
      });

      return res.status(200).json({
        success: true,
        message: "Admin login successful",
        data: {
          role: "admin",
           accessToken: tokens.accessToken,
           refreshToken: tokens.refreshToken,
        },
      });
    }

    // check user
    const user = await User.findOne({ email }).select(
      "+password +refreshTokens"
    );
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (user.accountStatus === "restricted") {
      return res
        .status(403)
        .json({ success: false, message: "Account restricted" });
    }

    pruneExpiredRefreshTokens(user);

    if (hasActiveRefreshToken(user)) {
      return res.status(409).json({
        success: false,
        message:
          "User already logged in. Log out first or wait for refresh to expire.",
      });
    }

    const tokens = buildAuthPayload(user, "user");
    await saveRefreshToken(user, tokens.refreshToken, req);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    logger.info({
      message: `User login: ${email}`,
      route: "login",
      service: "auth",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        role: "user",
         accessToken: tokens.accessToken,
         refreshToken: tokens.refreshToken,
      },
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "login",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- get me ----------

export const getMe = async (req, res) => {
  try {
    if (req.role === "user") {
      return res.status(200).json({
        success: true,
        data: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          phone: req.user.phone,
          role: "user",
          accountStatus: req.user.accountStatus,
          createdAt: req.user.createdAt,
        },
      });
    }

    if (req.role === "admin" || req.role === "investigator") {
      return res.status(200).json({
        success: true,
        data: {
          id: req.admin._id,
          fullName: req.admin.fullName,
          email: req.admin.email,
          role: req.admin.role,
          createdAt: req.admin.createdAt,
        },
      });
    }

    return res.status(403).json({ success: false, message: "Invalid role" });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "getMe",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- refresh ----------

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token required" });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token. Please log in again.",
      });
    }

    const model = decoded.role === "user" ? User : Admin;
    const entity = await model.findById(decoded.id).select("+refreshTokens");
    if (!entity) {
      return res
        .status(401)
        .json({ success: false, message: "Account not found" });
    }

    const incomingHash = hashToken(refreshToken);
    const matched = entity.refreshTokens.find(
      (rt) => rt.tokenHash === incomingHash
    );

    if (!matched || matched.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not recognized or expired. Please log in again.",
      });
    }

    const newAccessToken = generateAccessToken({
      id: entity._id,
      role: decoded.role,
    });

    const accessMinutes =
      Number(String(CONFIG.ACCESS_TOKEN_EXPIRES_IN).replace("m", "")) || 2;
    res.cookie("accessToken", newAccessToken, cookieOptions(accessMinutes));
return res.status(200).json({
  success: true,
  message: "Token refreshed",
  data: { accessToken: newAccessToken },
});
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "refresh",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- logout (this session) ----------

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      clearAuthCookies(res);
      return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    }

    const model = req.role === "user" ? User : Admin;
    const entity = await model
      .findById(req.user?._id || req.admin?._id)
      .select("+refreshTokens");

    if (entity) {
      const incomingHash = hashToken(refreshToken);
      entity.refreshTokens = entity.refreshTokens.filter(
        (rt) => rt.tokenHash !== incomingHash
      );
      await entity.save();
    }

    clearAuthCookies(res);

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "logout",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- logout all devices ----------

export const logoutAll = async (req, res) => {
  try {
    const model = req.role === "user" ? User : Admin;
    const entity = await model
      .findById(req.user?._id || req.admin?._id)
      .select("+refreshTokens");

    if (entity) {
      entity.refreshTokens = [];
      await entity.save();
    }

    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "logoutAll",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- forgot password ----------

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.validated;

    const genericResponse = {
      success: true,
      message: "If the email exists, an OTP has been sent.",
    };

    const user = await User.findOne({ email }).select(
      "+otpHash +otpExpiresAt +otpLastSentAt"
    );

    if (!user) return res.status(200).json(genericResponse);

    if (user.otpLastSentAt) {
      const secondsSince =
        (Date.now() - new Date(user.otpLastSentAt).getTime()) / 1000;
      if (secondsSince < CONFIG.OTP_RESEND_COOLDOWN_SECONDS) {
        const wait = Math.ceil(
          CONFIG.OTP_RESEND_COOLDOWN_SECONDS - secondsSince
        );
        return res.status(429).json({
          success: false,
          message: `Please wait ${wait}s before requesting a new OTP.`,
          retryAfterSeconds: wait,
        });
      }
    }

    const otpMinutes = Number(CONFIG.OTP_EXPIRES_MINUTES);
    if (!Number.isFinite(otpMinutes) || otpMinutes <= 0) {
      return res.status(500).json({
        success: false,
        message: "OTP_EXPIRES_MINUTES is not configured correctly",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpHash = hashToken(otp);
    user.otpExpiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);
    user.otpLastSentAt = new Date();
    await user.save();

    await sendOtpEmail(email, otp);

    logger.info({
      message: `OTP sent to ${email}`,
      route: "forgotPassword",
      service: "auth",
    });

    if (CONFIG.NODE_ENV === "development" || CONFIG.NODE_ENV === "dev") {
      return res.status(200).json({ ...genericResponse, devOtp: otp });
    }
    return res.status(200).json(genericResponse);
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "forgotPassword",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- verify OTP ----------

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.validated;

    const user = await User.findOne({ email }).select(
      "+otpHash +otpExpiresAt"
    );
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired. Request a new one." });
    }

    const incomingHash = hashToken(otp);
    if (incomingHash !== user.otpHash) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    const resetToken = generateResetToken({ id: user._id, purpose: "reset" });

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      data: { resetToken },
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "verifyOtp",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- reset password ----------

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.validated;

    let decoded;
    try {
      decoded = verifyResetToken(resetToken);
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    if (decoded.purpose !== "reset") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reset token" });
    }

    const user = await User.findById(decoded.id).select(
      "+otpHash +otpExpiresAt +refreshTokens"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reset token" });
    }

    user.password = newPassword;
    user.otpHash = null;
    user.otpExpiresAt = null;
    user.otpLastSentAt = null;
    user.refreshTokens = [];
    await user.save();

    logger.info({
      message: `Password reset for ${user.email}`,
      route: "resetPassword",
      service: "auth",
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in.",
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "resetPassword",
      service: "auth",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};