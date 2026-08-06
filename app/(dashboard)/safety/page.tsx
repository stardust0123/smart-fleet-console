import DashboardHeader from "@/components/dashboard/DashboardHeader";

import SafetyDashboard from "@/components/dashboard/safety/SafetyDashboard";

import { loadSafetyDashboard } from "@/services/dashboard/safety";

export default async function SafetyPage() {

  const {

    kpis,

    recentReviews,

    highRiskDrivers,

    trendMatrix,

    retrainingQueue,

    severityDistribution,

  } = await loadSafetyDashboard();

  return (

    <>

      <DashboardHeader
        title="Safety Dashboard"
        description="Monitor driver safety, incident reviews and retraining activities."
      />

      <SafetyDashboard

        kpis={kpis}

        recentReviews={recentReviews}

        highRiskDrivers={highRiskDrivers}

        trendMatrix={trendMatrix}

        retrainingQueue={retrainingQueue}

        severityDistribution={severityDistribution}

      />

    </>

  );

}