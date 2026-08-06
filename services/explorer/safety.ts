import {
  getIncidentReviews,
  getHighRiskDriversByMonth,
  searchSafetyIncidents,
  getUnresolvedIncidentReviews,
  updateIncidentReview,
} from "@/repositories/explorer/safety";

import {
  SafetyIncidentFilters,
  SafetyScoreFilters,
} from "@/types/safety";

/* ------------------------------- */
/* Initial Explorer Load           */
/* ------------------------------- */

export async function loadSafetyExplorer() {
  const [
    incidentReviews,
    safetyScores,
  ] = await Promise.all([
    getIncidentReviews(),

    // default month
    getHighRiskDriversByMonth("2026-02"),
  ]);

  return {
    incidentReviews,
    safetyScores,
  };
}

/* ------------------------------- */
/* Incident Review Search          */
/* ------------------------------- */

export async function searchExplorer(
  filters: SafetyIncidentFilters
) {
  return await searchSafetyIncidents(filters);
}

/* ------------------------------- */
/* Safety Score Search             */
/* ------------------------------- */

export async function searchSafetyScores(
  filters: SafetyScoreFilters
) {
  return await getHighRiskDriversByMonth(
    filters.scoreMonth ?? "2026-02"
  );
}

/* ------------------------------- */
/* Pending Reviews                 */
/* ------------------------------- */

export async function loadUnresolvedReviews() {
  return await getUnresolvedIncidentReviews();
}

export async function saveIncidentReview(
  reviewId: number,
  decision: string,
  comments: string
) {
  await updateIncidentReview(
    reviewId,
    decision,
    comments
  );
}

