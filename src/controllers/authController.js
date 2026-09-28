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
import { APIError } from "../utils/APIError.js";

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
    throw APIError.internal("REFRESH_TOKEN_EXPIRES_MINUTES is not configured correctly");
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

export const register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.validated;

    const exists = await User.findOne({ email });
    if (exists) {
      return next(APIError.conflict("Email already registered"));
    }

    await User.create({ fullName, email, phone, password });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- login ----------

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    // check admin first
    const admin = await Admin.findOne({ email }).select(
      "+password +refreshTokens"
    );
    if (admin && (await admin.matchPassword(password))) {
      pruneExpiredRefreshTokens(admin);

      if (hasActiveRefreshToken(admin)) {
        return next(
          APIError.conflict(
            "Admin already logged in. Log out first or wait for refresh to expire."
          )
        );
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
      return next(APIError.unauthorized("Invalid email or password"));
    }

    if (user.accountStatus === "restricted") {
      return next(APIError.forbidden("Account restricted"));
    }

    pruneExpiredRefreshTokens(user);

    if (hasActiveRefreshToken(user)) {
      return next(
        APIError.conflict(
          "User already logged in. Log out first or wait for refresh to expire."
        )
      );
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
    return next(err);
  }
};

// ---------- get me ----------

export const getMe = async (req, res, next) => {
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

    return next(APIError.forbidden("Invalid role"));
  } catch (err) {
    return next(err);
  }
};

// ---------- refresh ----------

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(APIError.unauthorized("Refresh token required"));
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return next(
        APIError.unauthorized("Invalid or expired refresh token. Please log in again.")
      );
    }

    const model = decoded.role === "user" ? User : Admin;
    const entity = await model.findById(decoded.id).select("+refreshTokens");
    if (!entity) {
      return next(APIError.unauthorized("Account not found"));
    }

    const incomingHash = hashToken(refreshToken);
    const matched = entity.refreshTokens.find(
      (rt) => rt.tokenHash === incomingHash
    );

    if (!matched || matched.expiresAt < new Date()) {
      return next(
        APIError.unauthorized(
          "Refresh token not recognized or expired. Please log in again."
        )
      );
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
    return next(err);
  }
};

// ---------- logout (this session) ----------

export const logout = async (req, res, next) => {
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
    return next(err);
  }
};

// ---------- logout all devices ----------

export const logoutAll = async (req, res, next) => {
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
    return next(err);
  }
};

// ---------- forgot password ----------

export const forgotPassword = async (req, res, next) => {
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
        return next(
          APIError.tooMany(`Please wait ${wait}s before requesting a new OTP.`)
        );
      }
    }

    const otpMinutes = Number(CONFIG.OTP_EXPIRES_MINUTES);
    if (!Number.isFinite(otpMinutes) || otpMinutes <= 0) {
      return next(
        APIError.internal("OTP_EXPIRES_MINUTES is not configured correctly")
      );
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

    return res.status(200).json(genericResponse);
  } catch (err) {
    return next(err);
  }
};

// ---------- verify OTP ----------

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.validated;

    const user = await User.findOne({ email }).select(
      "+otpHash +otpExpiresAt"
    );
    if (!user || !user.otpHash || !user.otpExpiresAt) {
      return next(APIError.badRequest("Invalid or expired OTP"));
    }

    if (user.otpExpiresAt < new Date()) {
      return next(APIError.badRequest("OTP expired. Request a new one."));
    }

    const incomingHash = hashToken(otp);
    if (incomingHash !== user.otpHash) {
      return next(APIError.badRequest("Invalid OTP"));
    }

    const resetToken = generateResetToken({ id: user._id, purpose: "reset" });

    return res.status(200).json({
      success: true,
      message: "OTP verified",
      data: { resetToken },
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- reset password ----------

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.validated;

    let decoded;
    try {
      decoded = verifyResetToken(resetToken);
    } catch (err) {
      return next(APIError.badRequest("Invalid or expired reset token"));
    }

    if (decoded.purpose !== "reset") {
      return next(APIError.badRequest("Invalid reset token"));
    }

    const user = await User.findById(decoded.id).select(
      "+otpHash +otpExpiresAt +refreshTokens"
    );
    if (!user) {
      return next(APIError.badRequest("Invalid reset token"));
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
    return next(err);
  }
};