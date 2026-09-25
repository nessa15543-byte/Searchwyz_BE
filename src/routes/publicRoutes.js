import express from "express";
import { validate } from "../middleware/validate.js";
import { createClueSchema } from "../validations/clueValidation.js";
import { caseIdParamSchema } from "../validations/caseValidation.js";
import {
  searchCases,
  getCaseById,
  submitClue,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Public routes ready" });
});

router.get("/cases", searchCases);
router.get("/cases/:id", validate(caseIdParamSchema), getCaseById);
router.post(
  "/cases/:id/clues",
  validate(caseIdParamSchema),
  validate(createClueSchema),
  submitClue
);

export default router;