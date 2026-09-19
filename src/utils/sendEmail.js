import { transporter } from "../config/email.js";
import { CONFIG } from "../config/index.js";

export const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Searchwyz" <${CONFIG.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

export const sendOtpEmail = async (to, otp) => {
  const subject = "Searchwyz Password Reset OTP";
  const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2>Searchwyz Password Reset</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    </div>
  `;
  return sendEmail({ to, subject, text, html });
};