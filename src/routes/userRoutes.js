import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All user routes are protected.
router.use(protect);

router.get("/dashboard", (req, res) => {
  res.json({
    success: true,
    message: "User dashboard",
    data: { userId: req.user._id, role: req.role }, 
    
  });
});

export default router;