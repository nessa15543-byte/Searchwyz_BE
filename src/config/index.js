import dotenv from "dotenv";
dotenv.config();

const splitList = (value) =>
  String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export const CONFIG = {
  APP_NAME: process.env.APP_NAME ,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV ,

  MONGO_URI: process.env.MONGO_URI,
  ERROR_LOG_URL: process.env.ERROR_LOG_URL,
  LOG_LEVEL: process.env.LOG_LEVEL ,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN ,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN ,
  REFRESH_TOKEN_EXPIRES_MINUTES: Number(process.env.REFRESH_TOKEN_EXPIRES_MINUTES),

  OTP_EXPIRES_MINUTES: Number(process.env.OTP_EXPIRES_MINUTES ),
  OTP_RESEND_COOLDOWN_SECONDS: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS ),
  RESET_TOKEN_EXPIRES_MINUTES: Number(process.env.RESET_TOKEN_EXPIRES_MINUTES ),

  FRONTEND_URL: process.env.FRONTEND_URL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

  ADMIN_NAME: process.env.ADMIN_NAME,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};

export const CORS_WHITELISTS = splitList(process.env.CORS_WHITELISTS);

export const CONSTANTS = {
  CASE_STATUS: [
    "Pending Verification",
    "Active",
    "Under Investigation",
    "Person Found",
    "Closed",
    "Rejected",
  ],
  CASE_STATUS_OBJ: {
    pendingVerification:"Pending Verification",
    active: "Active",
    underInvestigation:"Under Investigation",
    personFound:"Person Found",
    closed:"Closed",
   rejected: "Rejected"
  },
  CLUE_STATUS: ["Pending", "Verified", "Rejected", "Requires Review"],
  CLUE_STATUS_OBJ: {
   pending: "Pending", 
    verified:"Verified", 
   rejected: "Rejected", 
    requiresReview: "Requires Review"
  },
  ACCOUNT_TYPE: {
    user: "user",
    admin: "admin",
  },
  ACCOUNT_STATUS: {
    active: "action",
    restricted: "restricted",
  }
};

export default { CLUE_STATUS_OBJ,CONFIG, CORS_WHITELISTS, CONSTANTS, CASE_STATUS_OBJ };