/**
 * Normalize a location string so variants count as the same location.
 * - trim
 * - lowercase
 * - collapse spaces
 * - keep display form separately
 */
const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export const computeLocationRanking = (clues = []) => {
  if (!Array.isArray(clues) || clues.length === 0) {
    return {
      totalClues: 0,
      topLocation: null,
      ranking: [],
    };
  }

  const map = new Map();

  for (const clue of clues) {
    const key = normalizeKey(clue.location);
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, {
        location: clue.location.trim(),
        count: 0,
        lastReportedAt: clue.submittedAt || null,
      });
    }

    const entry = map.get(key);
    entry.count += 1;

    const t = clue.submittedAt ? new Date(clue.submittedAt).getTime() : 0;
    const prev = entry.lastReportedAt
      ? new Date(entry.lastReportedAt).getTime()
      : 0;

    if (t > prev) {
      entry.lastReportedAt = clue.submittedAt;
      entry.location = clue.location.trim();
    }
  }

  const ranking = Array.from(map.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return new Date(b.lastReportedAt) - new Date(a.lastReportedAt);
  });

  const ranked = ranking.map((entry, index) => ({
    rank: index + 1,
    location: entry.location,
    count: entry.count,
    lastReportedAt: entry.lastReportedAt,
  }));

  return {
    totalClues: clues.length,
    topLocation: ranked[0] || null,
    ranking: ranked,
  };
};