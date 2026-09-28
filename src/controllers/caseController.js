import Case from "../models/Case.js";
import Photo from "../models/Photo.js";
import logger from "../logger/index.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import { APIError } from "../utils/APIError.js";
import {
  caseReporterSummary,
  caseReporterView,
} from "../utils/caseView.js";

// ---------- create case ----------

export const createCase = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(APIError.badRequest("Photograph is required"));
    }

    const data = req.validated;

    const createdCase = await Case.create({
      ...data,
      reporterId: req.user._id,
      status: "Pending Verification",
    });

    const photo = await Photo.create({
      caseId: createdCase._id,
      uploadedBy: req.user._id,
      url: req.file.path,
      publicId: req.file.filename,
      format: req.file.mimetype?.split("/")[1] || null,
      bytes: req.file.size || null,
    });

    createdCase.photograph = photo._id;
    await createdCase.save();

    const populated = await Case.findById(createdCase._id).populate(
      "photograph"
    );

    logger.info({
      message: `Case created: ${createdCase._id}`,
      route: "createCase",
      service: "case",
    });

    return res.status(201).json({
      success: true,
      message: "Case submitted. Awaiting admin verification.",
      data: caseReporterSummary(populated),
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- list my cases ----------

export const getMyCases = async (req, res, next) => {
  try {
    const cases = await Case.find({ reporterId: req.user._id })
      .populate("photograph")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases.map(caseReporterSummary),
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- get one of my cases ----------

export const getMyCaseById = async (req, res, next) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");

    if (!c) {
      return next(APIError.notFound("Case not found"));
    }

    if (String(c.reporterId) !== String(req.user._id)) {
      return next(APIError.forbidden("Not your case"));
    }

    return res.status(200).json({
      success: true,
      data: caseReporterView(c),
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- update my case ----------

export const updateMyCase = async (req, res, next) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");

    if (!c) {
      return next(APIError.notFound("Case not found"));
    }

    if (String(c.reporterId) !== String(req.user._id)) {
      return next(APIError.forbidden("Not your case"));
    }

    if (c.status !== "Pending Verification") {
      return next(
        APIError.badRequest("Case can only be edited while Pending Verification")
      );
    }

    const updates = req.validated || {};
    Object.assign(c, updates);

    if (req.file) {
      if (c.photograph) {
        await deleteFromCloudinary(c.photograph.publicId);
        await Photo.findByIdAndDelete(c.photograph._id);
      }

      const newPhoto = await Photo.create({
        caseId: c._id,
        uploadedBy: req.user._id,
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.mimetype?.split("/")[1] || null,
        bytes: req.file.size || null,
      });

      c.photograph = newPhoto._id;
    }

    await c.save();
    const populated = await Case.findById(c._id).populate("photograph");

    return res.status(200).json({
      success: true,
      message: "Case updated",
      data: caseReporterSummary(populated),
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- delete my case ----------

export const deleteMyCase = async (req, res, next) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");

    if (!c) {
      return next(APIError.notFound("Case not found"));
    }

    if (String(c.reporterId) !== String(req.user._id)) {
      return next(APIError.forbidden("Not your case"));
    }

    if (!["Pending Verification", "Rejected"].includes(c.status)) {
      return next(
        APIError.badRequest(
          "Only Pending Verification or Rejected cases can be deleted"
        )
      );
    }

    if (c.photograph) {
      await deleteFromCloudinary(c.photograph.publicId);
      await Photo.findByIdAndDelete(c.photograph._id);
    }

    await Case.findByIdAndDelete(c._id);

    return res.status(200).json({
      success: true,
      message: "Case deleted",
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- reporter dashboard summary ----------

export const getMyDashboardSummary = async (req, res, next) => {
  try {
    const reporterId = req.user._id;

    const [total, pending, active, found] = await Promise.all([
      Case.countDocuments({ reporterId }),
      Case.countDocuments({ reporterId, status: "Pending Verification" }),
      Case.countDocuments({ reporterId, status: "Active" }),
      Case.countDocuments({ reporterId, status: "Person Found" }),
    ]);

    return res.status(200).json({
      success: true,
      data: { total, pending, active, found },
    });
  } catch (err) {
    return next(err);
  }
};