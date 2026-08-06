import {
  getIncidentReviews,
  getHighRiskDriversByMonth,
  searchSafetyIncidents,
  getUnresolvedIncidentReviews,
  updateIncidentReview,
  getDrivers,
  getDepots,
  getSafetyEvents,
  searchSafetyScores as searchSafetyScoresRepository,
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

    getHighRiskDriversByMonth("2026-02"),

    getDrivers(),

    getDepots(),

    getSafetyEvents(),

  ]);

  const safeIncidentReviews = incidentReviews.map((item: any) => ({
    ...item,

    event_timestamp:
      item.event_timestamp instanceof Date
        ? item.event_timestamp.toISOString()
        : item.event_timestamp,

    review_date:
      item.review_date instanceof Date
        ? item.review_date.toISOString()
        : item.review_date,
  }));

  const safeSafetyScores = safetyScores.map((item: any) => ({
    ...item,

    score_month:
      item.score_month instanceof Date
        ? item.score_month.toISOString()
        : item.score_month,

    calculated_at:
      item.calculated_at instanceof Date
        ? item.calculated_at.toISOString()
        : item.calculated_at,
  }));

  return {

    incidentReviews: safeIncidentReviews,

    safetyScores: safeSafetyScores,

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

export async function searchSafetyScoresService(
  filters: SafetyScoreFilters
) {

  return await searchSafetyScoresRepository(
    filters
  );

}

/* =======================================================
   BACKWARD COMPATIBILITY
======================================================= */

export async function searchSafetyScores(
  filters: SafetyScoreFilters
) {

  return await searchSafetyScoresRepository(
    filters
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