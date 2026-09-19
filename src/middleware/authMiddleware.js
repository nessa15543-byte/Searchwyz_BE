import { verifyAccessToken } from "../utils/generateToken.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Access token required" });
    }

    const token = header.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (decoded.role === "user") {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ success: false, message: "User not found" });
      if (user.accountStatus === "restricted") {
        return res.status(403).json({ success: false, message: "Account restricted" });
      }
      req.user = user;
      req.role = "user";
      return next();
    }

    if (decoded.role === "admin" || decoded.role === "investigator") {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) return res.status(401).json({ success: false, message: "Admin not found" });
      req.admin = admin;
      req.role = admin.role;
      return next();
    }

    return res.status(403).json({ success: false, message: "Invalid role" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "ACCESS_TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};