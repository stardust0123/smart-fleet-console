import {
  getIncidentReviews,
  getHighRiskDriversByMonth,
  searchSafetyIncidents,
  getUnresolvedIncidentReviews,
} from "@/repositories/explorer/safety";

import {
  SafetyIncidentFilters,
  SafetyScoreFilters, 
} from "@/types/safety";

/**
 * Initial load
 * Called when Safety Explorer is opened.
 */
export async function loadSafetyExplorer() {
  const [
    incidentReviews,
    safetyScores,
  ] = await Promise.all([
    getIncidentReviews(),
    getHighRiskDriversByMonth("2026-02-01"),
  ]);

  return {
    incidentReviews,
    safetyScores,
  };
}

/**
 * Search Incident Reviews
 */
export async function searchIncidents(
  filters: SafetyIncidentFilters
) {
  return await searchSafetyIncidents(filters);
}

/**
 * Pending Reviews only
 */
export async function loadPendingReviews() {
  return await getUnresolvedIncidentReviews();
}

/**
 * Safety Score
 */
export async function loadSafetyScores(
  month: string
) {
  return await getHighRiskDriversByMonth(
    month
  );
}

/**
 * Update Review
 */
