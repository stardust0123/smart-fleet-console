import {
  getSafetyKPIs,
  getRecentIncidentReviews,
  getHighRiskDriversDashboard,
  getSafetyTrendMatrix,
  getRetrainingQueue,
  getIncidentSeverityDistribution
} from "@/repositories/dashboard/safety";

/* =======================================================
   LOAD SAFETY DASHBOARD
======================================================= */

export async function loadSafetyDashboard() {

  const [

    kpis,

    recentReviews,

    highRiskDrivers,

    trendMatrix,

    retrainingQueue,

    severityDistribution,

  ] = await Promise.all([

    getSafetyKPIs(),

    getRecentIncidentReviews(),

    getHighRiskDriversDashboard(),

    getSafetyTrendMatrix(),

    getRetrainingQueue(),

    getIncidentSeverityDistribution()

  ]);

  // Serialize Date objects for Client Components

  const safeRecentReviews = recentReviews.map((item: any) => ({
    ...item,

    event_timestamp:
      item.event_timestamp instanceof Date
        ? item.event_timestamp.toISOString()
        : item.event_timestamp,
  }));

  const safeHighRiskDrivers = highRiskDrivers.map((item: any) => ({
    ...item,

    score_month:
      item.score_month instanceof Date
        ? item.score_month.toISOString()
        : item.score_month,
  }));

  const safeRetrainingQueue = retrainingQueue.map((item: any) => ({
    ...item,

    start_date:
      item.start_date instanceof Date
        ? item.start_date.toISOString()
        : item.start_date,

    end_date:
      item.end_date instanceof Date
        ? item.end_date.toISOString()
        : item.end_date,
  }));

  return {

    kpis,
    trendMatrix,


    severityDistribution,
    

    recentReviews: safeRecentReviews,

    highRiskDrivers: safeHighRiskDrivers,

    
    retrainingQueue: safeRetrainingQueue,

  };

}