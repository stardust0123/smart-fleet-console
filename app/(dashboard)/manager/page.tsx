import React from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { loadManagerDashboard } from "@/services/dashboard/manager";
import { revalidatePath } from "next/cache";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Truck, Wrench, AlertTriangle, Users, Package } from "lucide-react";

import WorkshopWorkloadChart from "@/components/charts/WorkshopWorkloadChart";
import PredictiveAlertChart from "@/components/charts/PredictiveAlertChart";
import TopVehiclesAlertChart from "@/components/charts/TopVehiclesAlertChart";
import ManagerCostChart from "@/components/charts/ManagerCostChart";
import UrgentRepairTable from "@/components/tables/UrgentRepairTable";
import InventoryAlertsTable from "@/components/tables/InventoryAlertsTable";
import RepeatedFaultsTable from "@/components/tables/RepeatedFaultsTable";

async function updatePartStock(formData: FormData) {
  "use server";
  const partName = formData.get("part_name") as string;
  const newQuantity = parseInt(formData.get("quantity") as string, 10);

  if (partName && !isNaN(newQuantity)) {
    try {
      await pool.query(`UPDATE part SET quantity = ? WHERE part_name = ?`, [newQuantity, partName]);
      revalidatePath("/manager");
    } catch (error) {}
  }
}

export default async function ManagerDashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined } | Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await Promise.resolve(searchParams);
  const selectedDepot = (resolvedParams?.depot as string) || "";
  const selectedMechanicId = (resolvedParams?.mechanicId as string) || "";

  const data = await loadManagerDashboard();
  const { 
    stats, workload, topVehicles, alertTypes, urgentRepairs, 
    costAndDowntime, repeatedFaults, lowStockParts, 
    supplierPerformance, expiringCertificates 
  } = data;

  // FALLBACK FETCH: Ensure inventory dropdown always has data
  let inventoryParts: RowDataPacket[] = [];
  try {
    const [parts] = await pool.query<RowDataPacket[]>(`SELECT part_name, quantity FROM part ORDER BY part_name ASC`);
    inventoryParts = parts;
  } catch (error) {
    // If table 'part' doesn't exist, provide temporary fallback items
    inventoryParts = [
      { part_name: "Brake Pads", quantity: 15 },
      { part_name: "Engine Oil (L)", quantity: 50 },
      { part_name: "Transmission Fluid", quantity: 8 },
      { part_name: "Air Filter", quantity: 2 },
    ] as any;
  }

  // Fetch mechanics
  let mechanicsList: RowDataPacket[] = [];
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT m.mechanic_id, m.full_name, d.depot_name 
      FROM mechanic m
      LEFT JOIN workshop w ON m.workshop_id = w.workshop_id
      LEFT JOIN depot d ON w.depot_code = d.depot_code
      WHERE NOT EXISTS (
        SELECT 1 FROM activity_assignment aa
        JOIN maintenance_activity ma ON aa.activity_id = ma.activity_id
        JOIN maintenance_job mj ON ma.job_id = mj.job_id
        WHERE aa.mechanic_id = m.mechanic_id AND mj.job_status NOT IN ('CLOSED', 'COMPLETED', 'Completed')
      )
    `);
    mechanicsList = rows;
  } catch (error) { mechanicsList = []; }

  const uniqueDepots = Array.from(new Set(mechanicsList.map((m: any) => m.depot_name))).filter(Boolean);
  const filteredMechanics = mechanicsList.filter((m: any) => {
    const matchesDepot = !selectedDepot || m.depot_name === selectedDepot;
    const matchesMechanicId = !selectedMechanicId || String(m.mechanic_id).toLowerCase().includes(selectedMechanicId.toLowerCase());
    return matchesDepot && matchesMechanicId;
  });

  return (
    <>
      <DashboardHeader 
        title="Fleet Management Dashboard" 
        description="Comprehensive overview of fleet health, predictive maintenance analytics, and workshop workload."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-sm font-medium text-black">Total Fleet Vehicles</p><h4 className="text-2xl font-bold text-black mt-1">{stats?.totalVehicles || 0}</h4></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Truck className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-sm font-medium text-black">Open Maintenance Jobs</p><h4 className="text-2xl font-bold text-black mt-1">{stats?.openJobs || 0}</h4></div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Wrench className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-sm font-medium text-black">Predictive Alerts</p><h4 className="text-2xl font-bold text-black mt-1">{stats?.predictiveAlerts || 0}</h4></div>
          <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="h-6 w-6" /></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div><p className="text-sm font-medium text-black">Active Mechanics</p><h4 className="text-2xl font-bold text-black mt-1">{stats?.mechanicsAvailable || 0}</h4></div>
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Users className="h-6 w-6" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h3 className="text-base font-semibold text-black mb-4">Workshop Workload Distribution</h3><WorkshopWorkloadChart data={workload} /></div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h3 className="text-base font-semibold text-black mb-4">Top Predictive Alert Types</h3><PredictiveAlertChart data={alertTypes} /></div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h3 className="text-base font-semibold text-black mb-4">Top Vehicles Generating Alerts</h3><TopVehiclesAlertChart data={topVehicles} /></div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h3 className="text-base font-semibold text-black mb-4">Maintenance Cost & Downtime by Model</h3><ManagerCostChart data={costAndDowntime} /></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h3 className="text-base font-semibold text-black flex items-center gap-2"><Users className="h-5 w-5 text-green-600" /> Available Mechanics Readiness</h3>
          <form action="/manager" method="GET" className="flex flex-wrap items-center gap-2">
            <input type="text" name="mechanicId" defaultValue={selectedMechanicId} placeholder="Mechanic ID" className="p-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            <select name="depot" defaultValue={selectedDepot} className="p-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option value="">All Depots</option>
              {uniqueDepots.map((depot: any) => <option key={depot} value={depot}>{depot}</option>)}
            </select>
            <button type="submit" className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">Filter</button>
            {(selectedDepot || selectedMechanicId) && <a href="/manager" className="text-sm text-blue-600 hover:underline px-2">Clear</a>}
          </form>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-900 sticky top-0">
              <tr><th className="px-4 py-3">Mechanic ID</th><th className="px-4 py-3">Full Name</th><th className="px-4 py-3">Depot Location</th><th className="px-4 py-3">Current Status</th></tr>
            </thead>
            <tbody>
              {filteredMechanics && filteredMechanics.length > 0 ? (
                filteredMechanics.map((mech: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-black">{mech.mechanic_id}</td><td className="px-4 py-3 text-black">{mech.full_name}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{mech.depot_name || 'N/A'}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium border border-green-200">Available</span></td>
                  </tr>
                ))
              ) : (<tr><td colSpan={4} className="px-4 py-8 text-center text-black">No available mechanics found.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
          <h3 className="text-base font-semibold text-black mb-4">Urgent Immediate Repairs</h3>
          <UrgentRepairTable data={urgentRepairs} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4 flex flex-col">
          <h3 className="text-base font-semibold text-black mb-4">Inventory Alerts & Supplier Deviations</h3>
          
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
            <h4 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-600" /> Manual Inventory Update
            </h4>
            <form action={updatePartStock} className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs text-gray-900 font-medium block mb-1">Select Part to Update</label>
                <select name="part_name" required className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">-- Choose a part --</option>
                  {inventoryParts.map((p: any, idx: number) => (
                    <option key={idx} value={p.part_name}>
                      {p.part_name} (Current: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-32">
                <label className="text-xs text-gray-900 font-medium block mb-1">New Quantity</label>
                <input type="number" name="quantity" required min="0" className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="0" />
              </div>
              <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Update Stock
              </button>
            </form>
          </div>

          <InventoryAlertsTable lowStockParts={lowStockParts} supplierPerformance={supplierPerformance} />
        </div>
      </div>
    </>
  );
}