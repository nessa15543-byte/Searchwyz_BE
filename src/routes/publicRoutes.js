import express from "express";

const router = express.Router();

// Day 2 will fill this.
// For now, health stub so the route group exists.
router.get("/health", (req, res) => {
  res.json({ success: true, message: "Public routes ready" });
});

export default router;