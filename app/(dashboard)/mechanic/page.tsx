import { Wrench, Award, FileText, AlertTriangle, Clock } from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";

import MechanicHistoryTable from "@/components/tables/MechanicHistoryTable";
import MechanicCertificationsTable from "@/components/tables/MechanicCertificationsTable";
import MechanicJobStatusChart from "@/components/charts/MechanicJobStatusChart";
import MechanicDiagnosticChart from "@/components/charts/MechanicDiagnosticChart";
import { loadMechanicDashboard } from "@/services/dashboard/mechanic";

export default async function MechanicDashboardPage() {
  const myMechanicId = 'MEC1004464';

  const {
    stats,
    certifications,
    jobStatusChart,
    diagnosticChart,
    myPendingJobs,
    completedJobs,
  } = await loadMechanicDashboard(myMechanicId);

  return (
    <>
      <DashboardHeader
        title="Mechanic Workspace"
        description="Overview of your assigned tasks, certifications, and maintenance history."
      />

      <DashboardGrid>
        <StatCard title="Active Certifications" value={stats.totalCertifications.toString()} icon={Award} />
        <StatCard title="My Assigned Jobs" value={stats.totalHistoricalJobs.toString()} icon={Wrench} />
        <StatCard title="Pending Jobs" value={stats.pendingJobs.toString()} icon={AlertTriangle} />
        <StatCard title="Diagnostics Logged" value={stats.totalDiagnostics.toString()} icon={FileText} />
        <StatCard title="Total Labour Hours" value={Number(stats.totalLabourHours).toString()} icon={Clock} />
      </DashboardGrid>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MechanicJobStatusChart data={jobStatusChart} />
        <MechanicDiagnosticChart data={diagnosticChart} />
      </div>

      <div className="mt-6">
        <MechanicHistoryTable
          data={myPendingJobs}
          showSearch={false}
          showFilters={false}
          limit={5}
          title="My Active Jobs"
          subtitle="Your 5 most recent non-completed jobs — see Explorer for the full list"
        />
      </div>

      {/* NEW: Completed jobs so the mechanic can see finished work */}
      <div className="mt-6">
        <MechanicHistoryTable
          data={completedJobs}
          showSearch={false}
          showFilters={false}
          readOnly
          limit={5}
          title="Completed Jobs"
          subtitle="Jobs you have finished (most recent 5)"
        />
      </div>

      <div className="mt-6">
        <MechanicCertificationsTable data={certifications || []} />
      </div>
    </>
  );
}