import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { loadDriverDashboard } from "@/services/dashboard/driver";
import DriverScoreChart from "@/components/charts/DriverScoreChart";
import DriverScoreTrendTable from "@/components/tables/DriverScoreTrendTable";
import DriverCertificationsTable from "@/components/tables/DriverCertificationsTable";
import DriverTripsTable from "@/components/tables/DriverTripsTable";
import DriverUpcomingMaintenanceTable from "@/components/tables/DriverUpcomingMaintenanceTable";

function extractDriverId(email: string): string {
  return email.split("@")[0].toUpperCase();
}

export default async function DriverDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let driverId = "";
  if (token) {
    try {
      const payload = await verifyToken(token);
      driverId = extractDriverId(String(payload.email ?? ""));
    } catch {
      driverId = "";
    }
  }

  const {
    profile,
    monthlyScores,
    certifications,
    alerts,
    trips,
    currentVehicle,
    upcomingMaintenance,
    criticalAlerts,
  } = await loadDriverDashboard(driverId);

  const info = profile[0] ?? {
    driver_id: driverId,
    full_name: "Unknown",
    email: "",
    phone: "",
    emergency_phone: null,
    depot_code: "",
    depot_name: null,
    status_name: "",
  };

  const latestScore =
    monthlyScores.length > 0
      ? monthlyScores[monthlyScores.length - 1].safety_score
      : null;
  const avgScore =
    monthlyScores.length > 0
      ? monthlyScores.reduce((sum, s) => sum + s.safety_score, 0) /
        monthlyScores.length
      : null;
  const prevScore =
    monthlyScores.length > 1
      ? monthlyScores[monthlyScores.length - 2].safety_score
      : null;
  const scoreDiff =
    latestScore !== null && prevScore !== null ? latestScore - prevScore : null;

  const currentVehicleInfo = currentVehicle[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="inline-block rounded-2xl border bg-white px-9 py-5 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{info.full_name}</h1>
        <p className="mt-1 text-lg text-black">
          Driver ID: {info.driver_id || "N/A"}
        </p>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-red-700">
            <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
            Critical Alerts
          </h2>
          <ul className="mt-2 space-y-1">
            {criticalAlerts.map((a) => (
              <li key={a.event_id} className="text-sm text-red-700">
                {a.event_timestamp} — {a.event_name} ({a.severity_name})
                {a.comments ? ` — ${a.comments}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Driver Information
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-black">Driver ID</dt>
              <dd className="font-medium text-slate-900">
                {info.driver_id || "N/A"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black">Status</dt>
              <dd>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    info.status_name === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  {info.status_name || "N/A"}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black">Email</dt>
              <dd className="font-medium text-slate-900">{info.email || "N/A"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black">Phone</dt>
              <dd className="font-medium text-slate-900">{info.phone || "N/A"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black">Depot</dt>
              <dd className="font-medium text-slate-900">
                {info.depot_name || info.depot_code || "N/A"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-black">Emergency</dt>
              <dd className="font-medium text-slate-900">
                {info.emergency_phone || "N/A"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Current Vehicle</h2>
          {currentVehicleInfo ? (
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {currentVehicleInfo.register_number}
              </p>
              <p className="mt-1 text-sm text-black">
                {currentVehicleInfo.manufacturer} {currentVehicleInfo.model} (
                {currentVehicleInfo.year_of_manufacture})
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-black">Vehicle ID</dt>
                  <dd className="font-medium text-slate-900">
                    {currentVehicleInfo.vehicle_id}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-black">Odometer</dt>
                  <dd className="font-medium text-slate-900">
                    {currentVehicleInfo.odometer_km.toLocaleString()} km
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-black">Assigned Since</dt>
                  <dd className="font-medium text-slate-900">
                    {currentVehicleInfo.assigned_from}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="mt-3 text-sm text-black">
              No vehicle currently assigned.
            </p>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Score Overview
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm text-black">Latest Score</p>
              <p className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                {latestScore !== null ? latestScore : "N/A"}
                {scoreDiff !== null && scoreDiff !== 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      scoreDiff > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {scoreDiff > 0 ? "▲" : "▼"} {Math.abs(scoreDiff)}
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Average Score</p>
              <p className="text-2xl font-bold text-slate-900">
                {avgScore !== null ? Number(avgScore).toFixed(1) : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-black">Warnings</p>
              <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <DriverUpcomingMaintenanceTable
        maintenance={upcomingMaintenance}
      />

      <DriverScoreChart monthlyScores={monthlyScores} />
      <DriverScoreTrendTable monthlyScores={monthlyScores} />

      <DriverCertificationsTable certifications={certifications} />

      <DriverTripsTable trips={trips} alerts={alerts} />
    </div>
  );
}