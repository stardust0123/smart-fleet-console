import React from "react";
import { LowStockPart, SupplierPerformance } from "@/types/dashboard";

interface InventoryAlertsProps {
  lowStockParts: LowStockPart[];
  supplierPerformance: SupplierPerformance[];
}

export default function InventoryAlertsTable({ lowStockParts, supplierPerformance }: InventoryAlertsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Low Stock Parts Section */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-red-100 bg-red-50/50">
          <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Low Stock Alerts
          </h3>
          <p className="text-sm text-red-600/80">Parts below reorder thresholds[cite: 1]</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3">Part Name</th>
                <th className="px-4 py-3 text-right">Current Qty</th>
                <th className="px-4 py-3 text-right">Threshold</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lowStockParts.length > 0 ? (
                lowStockParts.map((part, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{part.part_name}</td>
                    <td className="px-4 py-3 text-right font-bold text-red-600">{part.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{part.re_order_threshold}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">Reorder Needed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Inventory levels are optimal.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supplier Performance Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Supplier Price Deviations</h3>
          <p className="text-sm text-gray-500">Primary vs Backup suppliers[cite: 1]</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3">Part No.</th>
                <th className="px-4 py-3 text-right">Primary Price</th>
                <th className="px-4 py-3 text-right">Backup Price</th>
                <th className="px-4 py-3 text-right">Difference (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {supplierPerformance.map((perf, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{perf.part_number_1}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(perf.unit_price_1)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(perf.unit_price_2)}
                  </td>
                  <td className={`px-4 py-3 text-right font-medium ${Number(perf.percentage_diff) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(perf.percentage_diff).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}