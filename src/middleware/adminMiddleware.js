export const adminOnly = (req, res, next) => {
  if (req.role !== "admin" && req.role !== "investigator") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access only" });
  }
  next();
};