import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// All admin routes: must be logged in AND admin/investigator.
router.use(protect, adminOnly);

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "Admin dashboard",
    data: { adminId: req.admin._id, role: req.role },
  });
});

export default router;