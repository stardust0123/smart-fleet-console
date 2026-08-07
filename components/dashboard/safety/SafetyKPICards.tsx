"use client";

import { AlertTriangle, ShieldAlert, RotateCcw, Siren } from "lucide-react";
import { SafetyDashboardKPIs } from "@/types/dashboard";

interface Props {
  kpis: SafetyDashboardKPIs;
}

export default function SafetyKPICards({
  kpis,
}: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

      <KPICard
        title="Pending Reviews"
        value={kpis.pendingReviews}
        color="bg-amber-100 text-amber-700"
        icon={AlertTriangle}
      />

      <KPICard
        title="High Risk Drivers"
        value={kpis.highRiskDrivers}
        color="bg-red-100 text-red-700"
        icon={ShieldAlert}
      />

      <KPICard
        title="Retraining Required"
        value={kpis.retrainingRequired}
        color="bg-blue-100 text-blue-700"
        icon={RotateCcw}
      />

      <KPICard
        title="Critical Incidents"
        value={kpis.criticalIncidents}
        color="bg-purple-100 text-purple-700"
        icon={Siren}
      />

    </div>
  );
}

interface CardProps {

  title: string;

  value: number;

  color: string;

  icon: React.ComponentType<{ className?: string }>;

}

function KPICard({
  title,
  value,
  color,
  icon: Icon,
}: CardProps) {

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-black">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${color}`}
        >

          <Icon className="h-6 w-6" />

        </div>

      </div>

    </div>

  );

}