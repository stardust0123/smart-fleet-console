import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SafetyExplorer from "@/components/explorer/SafetyExplorer";

import { loadSafetyExplorer } from "@/services/explorer/safety";

export default async function SafetyExplorerPage() {

  const {

    incidentReviews,

    safetyScores,

    drivers,

    depots,

    events,

  } = await loadSafetyExplorer();

  return (
    <>

      <DashboardHeader
        title="Safety Explorer"
        description="Review incidents, monitor safety scores and investigate driver safety performance."
      />

      <SafetyExplorer
        incidentReviews={incidentReviews as any}
        safetyScores={safetyScores as any}

        drivers={drivers}
        depots={depots}
        events={events}
      />

    </>
  );

}