import { Wrench, Award, FileText, AlertTriangle, Clock } from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import StatCard from "@/components/dashboard/StatCard";

import MechanicHistoryTable from "@/components/tables/MechanicHistoryTable";
import MechanicCertificationsTable from "@/components/tables/MechanicCertificationsTable";
import MechanicJobStatusChart from "@/components/charts/MechanicJobStatusChart";
import MechanicDiagnosticChart from "@/components/charts/MechanicDiagnosticChart";
import { loadMechanicDashboard, loadMechanicProfile } from "@/services/dashboard/mechanic";

export default async function MechanicDashboardPage() {
  const myMechanicId = 'MEC1004464';

  const [
    {
      stats,
      certifications,
      jobStatusChart,
      diagnosticChart,
      myPendingJobs,
      completedJobs,
    },
    profile,
  ] = await Promise.all([
    loadMechanicDashboard(myMechanicId),
    loadMechanicProfile(myMechanicId),
  ]);

  return (
    <>
      <DashboardHeader
        title="Mechanic Workspace"
        description={
          profile
            ? `Hi, ${profile.full_name} (${profile.depot_code})`
            : "Overview of your assigned tasks, certifications, and maintenance history."
        }
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
          title="My Active Jobs"
          subtitle="All your non-completed jobs — see Explorer for full history"
        />
      </div>

      {/* Completed jobs so the mechanic can see finished work */}
      <div className="mt-6">
        <MechanicHistoryTable
          data={completedJobs}
          showSearch={false}
          showFilters={false}
          readOnly
          title="Completed Jobs"
          subtitle="All jobs you have finished — scroll to see more"
        />
      </div>

      <div className="mt-6">
        <MechanicCertificationsTable data={certifications || []} />
      </div>
    </>
  );
}