import {
  Truck,
  Route,
  Users,
  Wrench,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";
import ChartPlaceholder from "@/components/dashboard/ChartPlaceholer";
import ActivityTable from "@/components/dashboard/ActivityTable";

export default function OwnerDashboard() {
  return (
    <>
      <DashboardHeader
        title="Owner Dashboard"
        description="Overview of your fleet operations."
      />

      <DashboardGrid>
        <StatCard
          title="Total Vehicles"
          value="128"
          change="+5.2%"
          icon={Truck}
        />

        <StatCard
          title="Active Trips"
          value="94"
          change="+2.8%"
          icon={Route}
        />

        <StatCard
          title="Drivers"
          value="203"
          change="+1.4%"
          icon={Users}
        />

        <StatCard
          title="Maintenance Due"
          value="18"
          change="-3.1%"
          positive={false}
          icon={Wrench}
        />
      </DashboardGrid>

      <DashboardGrid cols={2}>
        <ChartPlaceholder
          title="Fleet Status"
          subtitle="Vehicle activity this year"
        />

        <ChartPlaceholder
          title="Trip Distribution"
          subtitle="Trips completed each month"
        />
      </DashboardGrid>

      <ActivityTable />
    </>
  );
}