import Case from "../models/Case.js";
import logger from "../logger/index.js";
import { computeLocationRanking } from "../utils/ranking.js";

const summarizePublicCase = (c, clues = []) => ({
  id: c._id,
  fullName: c.fullName,
  age: c.age,
  gender: c.gender,
  height: c.height,
  physicalDescription: c.physicalDescription,
  clothingLastSeen: c.clothingLastSeen,
  lastKnownLocation: c.lastKnownLocation,
  dateLastSeen: c.dateLastSeen,
  timeLastSeen: c.timeLastSeen,
  additionalInfo: c.additionalInfo,
  photograph: c.photograph?.url || null,
  status: c.status,
  createdAt: c.createdAt,
  cluesCount: clues.length,
  topLocation: computeLocationRanking(clues).topLocation,
});

// ---------- search verified cases ----------

export const searchCases = async (req, res) => {
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
      data: cases.map((c) => summarizePublicCase(c, c.clues)),
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "searchCases",
      service: "public",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- view one verified case ----------

export const getCaseById = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id).populate("photograph");

    if (!c) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    if (!["Active", "Under Investigation", "Person Found"].includes(c.status)) {
      return res
        .status(404)
        .json({ success: false, message: "Case not available" });
    }

    return res.status(200).json({
      success: true,
      data: summarizePublicCase(c, c.clues),
    });
  } catch (err) {
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "getCaseById",
      service: "public",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- submit a clue ----------

export const submitClue = async (req, res) => {
  try {
    const c = await Case.findById(req.params.id);

    if (!c) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    if (!["Active", "Under Investigation"].includes(c.status)) {
      return res
        .status(400)
        .json({ success: false, message: "Case is not open for clues" });
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
    logger.error({
      message: err.message,
      stack: err.stack,
      route: "submitClue",
      service: "public",
    });
    return res.status(500).json({ success: false, message: err.message });
  }
};