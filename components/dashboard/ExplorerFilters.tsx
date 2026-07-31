import DashboardCard from "./DashboardCard";
import { Search, RotateCcw } from "lucide-react";

export default function ExplorerFilters() {
  return (
    <DashboardCard>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Fleet Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter fleet records before viewing the results.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Depot */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Depot
          </label>

          <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option>All Depots</option>
            <option>North Depot</option>
            <option>South Depot</option>
            <option>East Depot</option>
            <option>West Depot</option>
          </select>
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Vehicle Type
          </label>

          <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option>All Vehicles</option>
            <option>Truck</option>
            <option>Van</option>
            <option>Bus</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option>All Status</option>
            <option>Active</option>
            <option>Maintenance</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Driver */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Driver
          </label>

          <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option>All Drivers</option>
            <option>John Smith</option>
            <option>Emily Brown</option>
            <option>Michael Lee</option>
            <option>Sarah Wilson</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Date Range
          </label>

          <select className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
            <Search className="h-4 w-4" />
            Search
          </button>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}