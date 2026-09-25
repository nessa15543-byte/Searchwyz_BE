import { computeLocationRanking } from "./ranking.js";

// Base fields every view shares.
const baseFields = (c) => ({
  id: c._id,
  fullName: c.fullName,
  age: c.age,
  gender: c.gender,
  height: c.height,
  lastKnownLocation: c.lastKnownLocation,
  dateLastSeen: c.dateLastSeen,
  timeLastSeen: c.timeLastSeen,
  status: c.status,
  photograph: c.photograph?.url || null,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
});

// Reporter's own view: adds description, clothing, notes, clues, ranking.
export const caseReporterView = (c) => {
  const ranking = computeLocationRanking(c.clues || []);
  return {
    ...baseFields(c),
    physicalDescription: c.physicalDescription,
    clothingLastSeen: c.clothingLastSeen,
    additionalInfo: c.additionalInfo,
    adminNote: c.adminNote,
    cluesCount: ranking.totalClues,
    topLocation: ranking.topLocation,
    clues: c.clues || [],
    ranking: ranking.ranking,
  };
};

// Reporter summary (list row): only counts, no clues array.
export const caseReporterSummary = (c) => {
  const ranking = computeLocationRanking(c.clues || []);
  return {
    ...baseFields(c),
    cluesCount: ranking.totalClues,
    topLocation: ranking.topLocation,
  };
};

// Public view: no adminNote, no reporterId, no clue list.
export const casePublicView = (c) => {
  const ranking = computeLocationRanking(c.clues || []);
  return {
    ...baseFields(c),
    physicalDescription: c.physicalDescription,
    clothingLastSeen: c.clothingLastSeen,
    additionalInfo: c.additionalInfo,
    cluesCount: ranking.totalClues,
    topLocation: ranking.topLocation,
  };
};