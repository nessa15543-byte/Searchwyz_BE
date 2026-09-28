import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { allClues, approveCase, deleteCase, deleteUserAcct, getCaseLocationStats, getDashboardTotal, getPendingCases, getPendingClues, getRegisteredUsers, pendingCase, rejectCase, requestReporterAdditionalInfo, restrictUserAcct, updateCaseStatus, updateClueStatus } from "../controllers/adminController.js";

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

router.get("/dashboard/totals",getDashboardTotal);
router.get("/cases/:id/locations",getCaseLocationStats);

router.get("/cases/pending", getPendingCases);
router.patch("/cases/:id/status", updateCaseStatus);

router.patch("/cases/:id/approve", approveCase);
router.patch("/cases/:id/reject", rejectCase);
router.patch("/cases/:id/pending", pendingCase);
router.patch("/cases/:id/delete", deleteCase);

router.get("/clues", allClues);
router.get("/clues/pending", getPendingClues);
router.patch("/clues/status", updateClueStatus);

router.get("/user/registered",getRegisteredUsers);
router.patch("/user/:id/restrict", restrictUserAcct);

router.post("/cases/:id/info-request", requestReporterAdditionalInfo);
// router.put("/system/settings", updateSystemSetting);
router.delete("/user/:id", deleteUserAcct);

export default router;