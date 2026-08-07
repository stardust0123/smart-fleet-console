"use client";

import { Search, RotateCcw } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type DepotOption = {
  depot_code: string;
  depot_name: string;
};

type StatusOption = {
  status_code: string;
  status_name: string;
};

export default function DriverExplorerFilters({
  depots,
  statuses,
}: {
  depots: DepotOption[];
  statuses: StatusOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status_code") ?? "";
  const currentDepot = searchParams.get("depot_code") ?? "";
  const currentKeyword = searchParams.get("keyword") ?? "";

  function applyFilter() {
    const form = document.getElementById("driver-explorer-filter") as HTMLFormElement;
    if (!form) return;

    const formData = new FormData(form);
    const params = new URLSearchParams();

    const status = String(formData.get("status_code") ?? "");
    const depot = String(formData.get("depot_code") ?? "");
    const keyword = String(formData.get("keyword") ?? "").trim();

    if (status) params.set("status_code", status);
    if (depot) params.set("depot_code", depot);
    if (keyword) params.set("keyword", keyword);

    router.push(`${pathname}?${params.toString()}`);
  }

  function resetFilter() {
    router.push(pathname);
  }

  return (
    <form
      id="driver-explorer-filter"
      className="rounded-2xl border bg-white p-6 shadow-sm"
      onSubmit={(e) => {
        e.preventDefault();
        applyFilter();
      }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
        <p className="mt-1 text-sm text-gray-800">
          Filter driver records using one or more criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <FilterSelect
          label="Status"
          name="status_code"
          placeholder="All Status"
          options={statuses.map((s) => ({
            value: s.status_code,
            label: s.status_name,
          }))}
          defaultValue={currentStatus}
        />

        <FilterSelect
          label="Depot"
          name="depot_code"
          placeholder="All Depots"
          options={depots.map((d) => ({
            value: d.depot_code,
            label: d.depot_name,
          }))}
          defaultValue={currentDepot}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-800">Keyword</label>
          <input
            type="text"
            name="keyword"
            defaultValue={currentKeyword}
            placeholder="Search by name or ID..."
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={resetFilter}
          className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-slate-100"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Search size={18} />
          Search
        </button>
      </div>
    </form>
  );
}

function FilterSelect({
  label,
  name,
  placeholder,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  defaultValue: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-800">{label}</label>
      <select
        name={name}
        defaultValue={defaultValue}
        className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}