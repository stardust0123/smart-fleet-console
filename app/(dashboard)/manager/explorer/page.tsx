import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Wrench, AlertTriangle } from "lucide-react";
import { getPredictiveAlerts, getMaintenanceHistory } from "@/repositories/explorer/manager";
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
  const [alerts, history] = await Promise.all([
    safeFetch(getPredictiveAlerts({ vehicle_id, alert_type, startDate }), []),
    safeFetch(getMaintenanceHistory({ vehicle_id, mechanic_id, startDate }), [])
  ]);

  return (
    <>
      <DashboardHeader
        title="Workshop Data Explorer"
        description="Search and analyze historical vehicle health, predictive alerts, and maintenance records."
      />

      {/* Main Filter Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <form action="/manager/explorer" method="GET" className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Vehicle</label>
            <select name="vehicle_id" defaultValue={vehicle_id} className="p-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="">All Vehicles</option>
              {vehicles?.map((v: any) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.register_number} - {v.model || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Mechanic (History Filter)</label>
            <select name="mechanic_id" defaultValue={mechanic_id} className="p-2 border border-gray-300 rounded-md bg-white text-sm">
              <option value="">All Mechanics</option>
              {mechanics?.map((m: any) => (
                <option key={m.mechanic_id} value={m.mechanic_id}>{m.full_name}</option>
              ))}
            </select>
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

      {/* Component Alerts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Component Health Alerts
          </h3>
          <span className="text-xs font-medium bg-white px-3 py-1 rounded-full border text-gray-600">{alerts?.length || 0} found</span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Vehicle ID</th>
                <th className="px-4 py-3 font-medium">Alert Type</th>
                <th className="px-4 py-3 font-medium">Severity</th>
                <th className="px-4 py-3 font-medium">Following Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts && alerts.length > 0 ? (
                alerts.map((a: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{a.timestamp ? new Date(a.timestamp).toLocaleString('vi-VN') : 'N/A'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{a.vehicle_id}</td>
                    
                    {/* Display clear descriptive error name, fallback to generic message if missing */}
                    <td className="px-4 py-3 font-medium text-blue-700">{a.alert_type || 'Unknown Code'}</td>
                    
                    <td className="px-4 py-3 text-amber-600 font-medium">{a.severity}</td>
                    <td className="px-4 py-3 text-gray-600">{a.description}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No alerts found matching your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Maintenance History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-500" /> Maintenance History Records
          </h3>
          <span className="text-xs font-medium bg-white px-3 py-1 rounded-full border text-gray-600">{history?.length || 0} found</span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 sticky top-0">
              <tr>
                <th className="px-4 py-3 font-medium">Job ID</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Assigned Mechanics</th>
                <th className="px-4 py-3 font-medium">Open Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Cost (VND)</th>
              </tr>
            </thead>
            <tbody>
              {history && history.length > 0 ? (
                history.map((h: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{h.job_id}</td>
                    <td className="px-4 py-3 text-gray-700">{h.vehicle_id}</td>
                    <td className="px-4 py-3 text-blue-700 font-medium">{h.mechanics_assigned || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-gray-600">{h.start_date ? new Date(h.start_date).toLocaleDateString('vi-VN') : 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-md font-medium border ${h.job_status === 'CLOSED' || h.job_status === 'COMPLETED' || h.job_status === 'Completed' ? 'bg-gray-100 text-gray-700 border-gray-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {h.job_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 font-medium">
                      {h.total_cost_vnd ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(h.total_cost_vnd) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No history records found matching your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}