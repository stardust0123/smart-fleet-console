import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PredictiveAlertsTable from "@/components/manager/PredictiveAlertsTable";
import MaintenanceHistoryTable from "@/components/manager/MaintenanceHistoryTable";
import { getPredictiveAlerts, getMaintenanceHistory } from "@/repositories/explorer/manager";
import { getExpiringCertificates } from "@/repositories/dashboard/manager";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Safe fetch wrapper to avoid UI crash on DB missing tables/columns
const safeFetch = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
  try { return await promise; } catch (error) { return fallback; }
};

export default async function WorkshopExplorerPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await Promise.resolve(searchParams);
  const vehicle_id = (resolvedParams?.vehicle_id as string) || "";
  const mechanic_id = (resolvedParams?.mechanic_id as string) || "";
  const alert_type = (resolvedParams?.alert_type as string) || "";
  const startDate = (resolvedParams?.startDate as string) || "";
  const certificateDays = Number(resolvedParams?.certificateDays ?? resolvedParams?.days ?? 30) || 30;

  // 1. Fetch Vehicles & Mechanics safely
  const [vehicles, mechanics] = await Promise.all([
    safeFetch(pool.query<RowDataPacket[]>(`SELECT vehicle_id, register_number, model FROM vehicle`).then(res => res[0]), []),
    safeFetch(pool.query<RowDataPacket[]>(`SELECT mechanic_id, full_name FROM mechanic`).then(res => res[0]), [])
  ]);
  
  // 2. Safely Fetch Filter Dropdown from predictive_alert_type table to get descriptive alert names
  let alertTypesDB: RowDataPacket[] = [];
  try {
    const [types] = await pool.query<RowDataPacket[]>(`SELECT alert_code, alert_name FROM predictive_alert_type ORDER BY alert_name ASC`);
    alertTypesDB = types;
  } catch (error) {
    alertTypesDB = [];
  }

  // 3. Fetch Data Concurrently based on active filters
  const [alerts, history, expiringCertificates] = await Promise.all([
    safeFetch(getPredictiveAlerts({ vehicle_id, alert_type, startDate }), []),
    safeFetch(getMaintenanceHistory({ vehicle_id, mechanic_id, startDate }), []),
    safeFetch(getExpiringCertificates(certificateDays), [])
  ]);

  return (
    <>
      <DashboardHeader
        title="Workshop Data Explorer"
        description="Search and analyze historical vehicle health, predictive alerts, and maintenance records."
      />

      {/* Main Filter Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <form action="/manager/explorer" method="GET" className="grid grid-cols-1 md:grid-cols-6 gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Vehicle</label>
            <input
              type="text"
              name="vehicle_id"
              defaultValue={vehicle_id}
              placeholder=" Search vehicle ID "
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Mechanic ID</label>
            <input
              type="text"
              name="mechanic_id"
              defaultValue={mechanic_id}
              placeholder="Search mechanic ID"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Alert Type</label>
            <select name="alert_type" defaultValue={alert_type} className="p-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="">All Alerts</option>
              {alertTypesDB?.map((type: any, idx: number) => (
                <option key={idx} value={type.alert_code}>
                  {type.alert_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Cert. expiry in (days)</label>
            <input type="number" min="1" step="1" name="certificateDays" defaultValue={certificateDays} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Start Date From</label>
            <input type="date" name="startDate" defaultValue={startDate} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm" />
          </div>

          <div className="flex items-end gap-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-medium text-sm transition-colors">
              Apply Filters
            </button>
            <a href="/manager/explorer" className="w-full text-center border border-gray-300 bg-white text-gray-700 p-2 rounded-md font-medium text-sm hover:bg-gray-50 transition-colors">
              Clear
            </a>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Mechanic Certificates Expiring Soon</h2>
            <p className="text-sm text-gray-500">Showing certificates that expire within {certificateDays} days.</p>
          </div>
        </div>

        {expiringCertificates && expiringCertificates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-amber-50 text-gray-700 border-b border-amber-100">
                <tr>
                  <th className="px-4 py-3">Mechanic ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Certification</th>
                  <th className="px-4 py-3">Expire Date</th>
                  <th className="px-4 py-3">Days Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expiringCertificates.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-amber-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.mechanic_id}</td>
                    <td className="px-4 py-3 text-gray-700">{item.full_name}</td>
                    <td className="px-4 py-3 text-gray-700">{item.certification_code}</td>
                    <td className="px-4 py-3 text-gray-700">{item.expire_date ? new Date(item.expire_date).toLocaleDateString("en-GB") : "N/A"}</td>
                    <td className={`px-4 py-3 font-semibold ${Number(item.days_remaining) <= 7 ? "text-red-600" : "text-amber-600"}`}>
                      {item.days_remaining}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No certificates expiring soon.</p>
        )}
      </div>

      <PredictiveAlertsTable data={alerts as any[]} />
      <MaintenanceHistoryTable data={history as any[]} />
    </>
  );
}