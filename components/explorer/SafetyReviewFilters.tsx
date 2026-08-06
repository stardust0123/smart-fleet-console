"use client";

import { useState } from "react";
import { SafetyIncidentFilters } from "@/types/safety";

interface Props {
  onSearch: (
    filters: SafetyIncidentFilters
  ) => void;
}

export default function SafetyReviewFilters({
  onSearch,
}: Props) {
  const [filters, setFilters] =
    useState<SafetyIncidentFilters>({
      reviewStatus: "Pending",
    });

  function update(
    key: keyof SafetyIncidentFilters,
    value: string
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  }

  return (
    <div className="rounded-xl border p-6">

      <div className="grid grid-cols-4 gap-4">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Driver
          </label>

          <input
            className="w-full rounded-lg border p-2"
            placeholder="Driver ID"
            onChange={(e) =>
              update("driverId", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Vehicle
          </label>

          <input
            className="w-full rounded-lg border p-2"
            placeholder="Vehicle ID"
            onChange={(e) =>
              update("vehicleId", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Depot
          </label>

          <input
            className="w-full rounded-lg border p-2"
            placeholder="Depot Code"
            onChange={(e) =>
              update("depotCode", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Event
          </label>

          <input
            className="w-full rounded-lg border p-2"
            placeholder="Event Code"
            onChange={(e) =>
              update("eventCode", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Severity
          </label>

          <select
            className="w-full rounded-lg border p-2"
            onChange={(e) =>
              update(
                "severityCode",
                e.target.value
              )
            }
          >
            <option value="">
              All
            </option>

            <option value="LOW">
              LOW
            </option>

            <option value="MED">
              MED
            </option>

            <option value="HIGH">
              HIGH
            </option>

            <option value="CRIT">
              CRIT
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Review Status
          </label>

          <select
            className="w-full rounded-lg border p-2"
            value={
              filters.reviewStatus ?? ""
            }
            onChange={(e) =>
              update(
                "reviewStatus",
                e.target.value
              )
            }
          >
            <option value="">
              All
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            From
          </label>

          <input
            type="date"
            className="w-full rounded-lg border p-2"
            onChange={(e) =>
              update(
                "startDate",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            To
          </label>

          <input
            type="date"
            className="w-full rounded-lg border p-2"
            onChange={(e) =>
              update(
                "endDate",
                e.target.value
              )
            }
          />
        </div>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          onClick={() =>
            onSearch(filters)
          }
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>

      </div>

    </div>
  );
}