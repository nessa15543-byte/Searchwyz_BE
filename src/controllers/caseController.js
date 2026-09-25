import Case from "../models/Case.js";
import Photo from "../models/Photo.js";
import logger from "../logger/index.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";
import { computeLocationRanking } from "../utils/ranking.js";

const summarizeCase = (c) => {   //Never send the raw DB document to the public. It may include reporter id, admin notes, and other internal fields.
  const ranking = computeLocationRanking(c.clues || []);
  return {
    id: c._id,
    fullName: c.fullName,
    age: c.age,
    gender: c.gender,
    lastKnownLocation: c.lastKnownLocation,
    dateLastSeen: c.dateLastSeen,
    timeLastSeen: c.timeLastSeen,
    status: c.status,
    photograph: c.photograph?.url || null,
    cluesCount: ranking.totalClues,
    topLocation: ranking.topLocation,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
};
// ---------- create case ----------

export const createCase = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Photograph is required" });
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
      data: summarizeCase(populated),
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "createCase",
      service: "case",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- list my cases ----------

export const getMyCases = async (req, res) => {
  try {
    const cases = await Case.find({ reporterId: req.user._id })
      .populate("photograph")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases.map(summarizeCase),
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "getMyCases",
      service: "case",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- get one of my cases ----------

export const getMyCaseById = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id)
      .populate("photograph")
      .populate("clues");

    if (!c) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    if (String(c.reporterId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not your case" });
    }

   return res.status(200).json({
  success: true,
  data: {
    ...summarizeCase(c),
    physicalDescription: c.physicalDescription,
    clothingLastSeen: c.clothingLastSeen,
    height: c.height,
    additionalInfo: c.additionalInfo,
    adminNote: c.adminNote,
    clues: c.clues,
    ranking: computeLocationRanking(c.clues || []).ranking,
  },
});
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "getMyCaseById",
      service: "case",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- update my case ----------

export const updateMyCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");
    if (!c) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    if (String(c.reporterId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not your case" });
    }

    if (c.status !== "Pending Verification") {
      return res.status(400).json({
        success: false,
        message: "Case can only be edited while Pending Verification",
      });
    }

    const updates = req.validated || {};
    Object.assign(c, updates);

    if (req.file) {
      // delete old photo from Cloudinary and Photo collection
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
      data: summarizeCase(populated),
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "updateMyCase",
      service: "case",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- delete my case ----------

export const deleteMyCase = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");
    if (!c) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    if (String(c.reporterId) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ success: false, message: "Not your case" });
    }

    if (!["Pending Verification", "Rejected"].includes(c.status)) {
      return res.status(400).json({
        success: false,
        message: "Only Pending Verification or Rejected cases can be deleted",
      });
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
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "deleteMyCase",
      service: "case",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- reporter dashboard summary ----------

export const getMyDashboardSummary = async (req, res) => {
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
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "getMyDashboardSummary",
      service: "case",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};