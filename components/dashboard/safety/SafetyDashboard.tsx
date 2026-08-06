"use client";

import SafetyKPICards from "./SafetyKPICards";

import RecentIncidentTable from "../../tables/RecentIncidentTable";
import HighRiskDriverTable from "../../tables/HighRiskDriverTable";
import RetrainingQueueTable from "../../tables/RetrainingQueueTable";

import SafetyTrendHeatmap from "@/components/charts/SafetyTrendHeatmap";
import IncidentSeverityChart from "@/components/charts/IncidentSeverityChart";

import {
  SafetyDashboardKPIs,
  RecentIncidentReview,
  HighRiskDriver,
  SafetyTrend,
  RetrainingQueue,
  SeverityDistribution,
} from "@/types/dashboard";

interface Props {
  kpis: SafetyDashboardKPIs;

  recentReviews: RecentIncidentReview[];

  highRiskDrivers: HighRiskDriver[];

  trendMatrix: SafetyTrend[];

  retrainingQueue: RetrainingQueue[];

  severityDistribution: SeverityDistribution[];
}

export default function SafetyDashboard({
  kpis,
  recentReviews,
  highRiskDrivers,
  trendMatrix,
  retrainingQueue,
  severityDistribution,
}: Props) {
  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <SafetyKPICards
        kpis={kpis}
      />

      {/* Recent Reviews */}
      <RecentIncidentTable
        data={recentReviews}
      />

      {/* Heatmap + Severity Distribution */}
       <div className="grid grid-cols-12 gap-6 items-stretch">

            <div className="col-span-8 h-full">
                <SafetyTrendHeatmap
                    data={trendMatrix}
                />
            </div>

            <div className="col-span-4 h-full">
                <IncidentSeverityChart
                    data={severityDistribution}
                />
            </div>

        </div>

      {/* High Risk + Retraining */}
      <div className="grid grid-cols-2 gap-6">

        <HighRiskDriverTable
          data={highRiskDrivers}
        />

        <RetrainingQueueTable
          data={retrainingQueue}
        />

      </div>

    </div>
  );
}