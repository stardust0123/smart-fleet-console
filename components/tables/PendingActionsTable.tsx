import React from "react";
import { OverdueVehicle, AwaitingInspectionVehicle } from "@/types/dashboard";

interface PendingActionsProps {
  overdueVehicles: OverdueVehicle[];
  awaitingInspection: AwaitingInspectionVehicle[];
}

export default function PendingActionsTable({ overdueVehicles, awaitingInspection }: PendingActionsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Overdue Vehicles Section */}
      <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-orange-100 bg-orange-50/50">
          <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
            Overdue Maintenance
          </h3>
          <p className="text-sm text-orange-600/80">Vehicles exceeding 180 days since last service[cite: 1]</p>
        </div>
        <div className="overflow-x-auto h-64">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-900 font-medium border-b sticky top-0">
              <tr>
                <th className="px-4 py-3">Vehicle Reg</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3 text-right">Odometer (km)</th>
                <th className="px-4 py-3 text-right">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {overdueVehicles.length > 0 ? (
                overdueVehicles.map((vehicle, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-black">{vehicle.register_number}</td>
                    <td className="px-4 py-3 text-gray-900">{vehicle.model}</td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {new Intl.NumberFormat('vi-VN').format(vehicle.odometer_km)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-orange-600">
                      {vehicle.days_since_last_maintenance}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-black">All vehicles are up to date.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Awaiting Inspection Section */}
      <div className="bg-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-blue-100 bg-blue-50/50">
          <h3 className="text-lg font-semibold text-blue-700">Awaiting Inspection</h3>
          <p className="text-sm text-blue-600/80">Vehicles in depot requiring initial diagnosis[cite: 1]</p>
        </div>
        <div className="overflow-x-auto h-64">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-900 font-medium border-b sticky top-0">
              <tr>
                <th className="px-4 py-3">Vehicle ID</th>
                <th className="px-4 py-3">Vehicle Reg</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {awaitingInspection.length > 0 ? (
                awaitingInspection.map((vehicle, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-black">{vehicle.vehicle_id}</td>
                    <td className="px-4 py-3 text-gray-900">{vehicle.register_number}</td>
                    <td className="px-4 py-3 text-gray-900">{vehicle.model}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                        {vehicle.status_code}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-black">No vehicles waiting for inspection.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}