// import nodemailer from "nodemailer";
// import { CONFIG } from "./index.js";

// export const transporter = nodemailer.createTransport({
//   host: CONFIG.EMAIL_HOST,
//   port: Number(CONFIG.EMAIL_PORT),
//   secure: CONFIG.EMAIL_SECURE, // false for 587, true for 465
//   auth: {
//     user: CONFIG.EMAIL_USER,
//     pass: CONFIG.EMAIL_PASS,
//   },
//   connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 15000,
// });

// export const verifyEmailConnection = async () => {
//   try {
//     await transporter.verify();
//     console.log("Email transporter ready");
//   } catch (err) {
//     console.error("Email transporter failed:", err.message);
//   }
// };

import nodemailer from "nodemailer";
import { CONFIG } from "./index.js";

export const transporter = nodemailer.createTransport({
  host: CONFIG.EMAIL_HOST,
  port: Number(CONFIG.EMAIL_PORT),
  secure: Number(CONFIG.EMAIL_PORT) === 465,
  auth: {
    user: CONFIG.EMAIL_USER,
    pass: CONFIG.EMAIL_PASS,
  },
  family: 4,                    // ✅ force IPv4
  connectionTimeout: 15000,
  socketTimeout: 15000,
  greetingTimeout: 15000,
//   logger: true,                 // ✅ show what's happening
//   debug: true,                  // ✅ show SMTP traffic
});

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log(" Email transporter ready");
  } catch (err) {
    console.error("Email transporter failed:", err.message);
  }
};