import Case from "../models/Case.js";
import logger from "../logger/index.js";
import { computeLocationRanking } from "../utils/ranking.js";
import { casePublicView } from "../utils/caseView.js";
import { APIError } from "../utils/APIError.js";

// ---------- search verified cases ----------

export const searchCases = async (req, res, next) => {
  try {
    const { name, gender, location, status } = req.query;

    const filter = {
      status: status || "Active",
    };

    if (name) filter.fullName = { $regex: name, $options: "i" };
    if (gender) filter.gender = gender;
    if (location) filter.lastKnownLocation = { $regex: location, $options: "i" };

    const cases = await Case.find(filter)
      .populate("photograph")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: cases.length,
      data: cases.map(casePublicView),
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- view one verified case ----------

export const getCaseById = async (req, res, next) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");

    if (!c) {
      return next(APIError.notFound("Case not found"));
    }

    if (!["Active", "Under Investigation", "Person Found"].includes(c.status)) {
      return next(APIError.notFound("Case not available"));
    }

    return res.status(200).json({
      success: true,
      data: casePublicView(c),
    });
  } catch (err) {
    return next(err);
  }
};

// ---------- submit a clue ----------

export const submitClue = async (req, res, next) => {
  try {
    const c = await Case.findById(req.params.id);

    if (!c) {
      return next(APIError.notFound("Case not found"));
    }

    if (!["Active", "Under Investigation"].includes(c.status)) {
      return next(APIError.badRequest("Case is not open for clues"));
    }

    const { location, date, time, description } = req.validated;

    c.clues.push({
      location,
      date,
      time,
      description,
      submittedAt: new Date(),
    });

    await c.save();

    logger.info({
      message: `Clue submitted for case ${c._id} at ${location}`,
      route: "submitClue",
      service: "public",
    });

    const ranking = computeLocationRanking(c.clues);

    return res.status(201).json({
      success: true,
      message: "Sighting submitted. Thank you.",
      data: {
        caseId: c._id,
        totalClues: ranking.totalClues,
        topLocation: ranking.topLocation,
      },
    });
  } catch (err) {
    return next(err);
  }
};