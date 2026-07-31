import {
  Truck,
  Users,
  Wrench,
  TriangleAlert,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";

import WorkshopWorkloadChart from "@/components/charts/WorkshopWorkloadChart";
import TopVehiclesAlertChart from "@/components/charts/TopVehiclesAlertChart";
import PredictiveAlertTreemap from "@/components/charts/PredictiveAlertTreemap";
import UrgentRepairTable from "@/components/tables/UrgentRepairTable";

import { loadManagerDashboard } from "@/services/dashboard/manager";

export default async function ManagerDashboard() {
  const {
  stats,
  workload,
  topVehicles,
  alertTypes,
  urgentRepairs,
} = await loadManagerDashboard();
  return (
    <>
      <DashboardHeader
        title="Manager Dashboard"
        description="Overview of workshop operations."
      />

      <DashboardGrid>
        <StatCard
          title="Total Vehicles"
          value={stats.totalVehicles.toString()}
          icon={Truck}
        />

        <StatCard
          title="Open Jobs"
          value={stats.openJobs.toString()}
          icon={Wrench}
        />

        <StatCard
          title="Predictive Alerts"
          value={stats.predictiveAlerts.toString()}
          icon={TriangleAlert}
        />

        <StatCard
          title="Mechanics Available"
          value={stats.mechanicsAvailable.toString()}
          icon={Users}
        />
      </DashboardGrid>

      <DashboardGrid cols={2}>
        <WorkshopWorkloadChart
            data={workload}
          />
        <TopVehiclesAlertChart
          data={topVehicles}
        />
        <PredictiveAlertTreemap
          data={alertTypes}
        />
        <UrgentRepairTable
          data={urgentRepairs}
        />

      </DashboardGrid>

    </>
  );
}