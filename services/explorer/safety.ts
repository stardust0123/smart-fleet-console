import {
  getIncidentReviews,
  getHighRiskDriversByMonth,
  searchSafetyIncidents,
  getUnresolvedIncidentReviews,
  updateIncidentReview,
  getDrivers,
  getDepots,
  getSafetyEvents,
} from "@/repositories/explorer/safety";

import {
  SafetyIncidentFilters,
  SafetyScoreFilters,
} from "@/types/safety";

/* =======================================================
   INITIAL LOAD
======================================================= */

export async function loadSafetyExplorer() {

  const [

    incidentReviews,

    safetyScores,

    drivers,

    depots,

    events,

  ] = await Promise.all([

    getIncidentReviews(),

    // Default month
    getHighRiskDriversByMonth("2026-02"),

    getDrivers(),

    getDepots(),

    getSafetyEvents(),

  ]);

  return {

    incidentReviews,

    safetyScores,

    drivers,

    depots,

    events,

  };

}

/* =======================================================
   INCIDENT REVIEW SEARCH
======================================================= */

export async function searchExplorer(
  filters: SafetyIncidentFilters
) {

  return await searchSafetyIncidents(
    filters
  );

}

/* =======================================================
   SAFETY SCORE SEARCH
======================================================= */

export async function searchSafetyScores(
  filters: SafetyScoreFilters
) {

  return await getHighRiskDriversByMonth(

    filters.scoreMonth ??

    "2026-02"

  );

}

/* =======================================================
   UNRESOLVED REVIEWS
======================================================= */

export async function loadUnresolvedReviews() {

  return await getUnresolvedIncidentReviews();

}

/* =======================================================
   SAVE INCIDENT REVIEW
======================================================= */

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