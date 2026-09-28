import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { upload } from "../middleware/upload.js";
import {
  createCaseSchema,
  updateCaseSchema,
  caseIdParamSchema,
} from "../validations/caseValidation.js";
import {
  createCase,
  getMyCases,
  getMyCaseById,
  updateMyCase,
  deleteMyCase,
  getMyDashboardSummary,
} from "../controllers/caseController.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getMyDashboardSummary);

router.post(
  "/cases",
  upload.single("photograph"),
  validate(createCaseSchema),
  createCase
);

router.get("/cases", getMyCases);

router.get(
  "/cases/:id",
  validate(caseIdParamSchema),
  getMyCaseById
);

router.patch(
  "/cases/:id",
  upload.single("photograph"),
  validate(caseIdParamSchema),
  validate(updateCaseSchema),
  updateMyCase
);

router.delete(
  "/cases/:id",
  validate(caseIdParamSchema),
  deleteMyCase
);

export default router;