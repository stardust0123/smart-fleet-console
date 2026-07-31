"use client";

import { Search, RotateCcw } from "lucide-react";

export default function ExplorerFilters() {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Search Filters
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Filter fleet information using one or more criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        <FilterSelect
          label="Depot"
          options={[
            "All Depots",
            "North Depot",
            "South Depot",
            "East Depot",
            "West Depot",
          ]}
        />

        <FilterSelect
          label="Category"
          options={[
            "All Categories",
            "Truck",
            "Van",
            "Bus",
          ]}
        />

        <FilterSelect
          label="Status"
          options={[
            "All Status",
            "Available",
            "In Service",
            "Maintenance",
          ]}
        />

        <FilterSelect
          label="Manufacturer"
          options={[
            "All",
            "Toyota",
            "Ford",
            "Mercedes",
            "Hyundai",
          ]}
        />

        <FilterSelect
          label="Year"
          options={[
            "All Years",
            "2025",
            "2024",
            "2023",
            "2022",
          ]}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-slate-100">
          <RotateCcw size={18} />
          Reset
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
          <Search size={18} />
          Search
        </button>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  options: string[];
}

function FilterSelect({
  label,
  options,
}: FilterSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <select className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}