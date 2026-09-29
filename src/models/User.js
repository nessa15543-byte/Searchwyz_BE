import mongoose, { model, Schema } from "mongoose";
import { CONSTANTS } from "../config/index.js";

 
const AccountSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: null },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: Array.from(Object.values(CONSTANTS.ACCOUNT_TYPE)), default: CONSTANTS.ACCOUNT_TYPE.user  },
    accountStatus: { type: String, enum:Array.from(Object.values(CONSTANTS.ACCOUNT_STATUS)), default:CONSTANTS.ACCOUNT_STATUS.active },

    otpHash: { type: String, default: null, select: false },
    otpExpiresAt: { type: Date, default: null, select: false },
    otpLastSentAt: { type: Date, default: null, select: false },

    refreshTokens: { type: [String], default: [], select: false },
  },
  { timestamps: true }
);
 

 
const AccountModel = model("Account", userSchema);
export default AccountModel;