import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { allClues, approveCase, deleteCase, deleteUserAcct, getCaseLocationStats, getDashboardTotal, getPendingCases, getPendingClues, getRegisteredUsers, pendingCase, rejectCase, requestReporterAdditionalInfo, restrictUserAcct, updateCaseStatus, updateClueStatus } from "../controllers/adminController.js";

const router = express.Router();

// All admin routes: must be logged in AND admin/investigator.
router.use(protect, adminOnly);

// router.get("/dashboard",(req, res) => {
//   res.json({
//     success: true,
//     message: "Admin dashboard",
//     data: { adminId: req.admin._id, role: req.role },
//   });
// });

router.get("/dashboard-total",getDashboardTotal);
router.get("/cases/location/:id",getCaseLocationStats);

router.get("/cases/pending", getPendingCases);
router.patch("/cases/status/:id", updateCaseStatus);

router.patch("/cases/approve/:id", approveCase);
router.patch("/cases/reject/:id", rejectCase);
router.patch("/cases/pending/:id", pendingCase);
router.patch("/cases/delete/:id", deleteCase);

router.get("/clues", allClues);
router.get("/clues/pending", getPendingClues);
router.patch("/clues/status", updateClueStatus);

router.get("/registered",getRegisteredUsers);
router.patch("/restrict/:id", restrictUserAcct);

router.post("/cases/info-request/:id", requestReporterAdditionalInfo);
// router.put("/system/settings", updateSystemSetting);
router.delete("/delete/:id", deleteUserAcct);

export default router;