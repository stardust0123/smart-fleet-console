"use client";

import { useState } from "react";

import {
  DriverOption,
  DepotOption,
  EventOption,
  SafetyIncidentFilters,
} from "@/types/safety";

interface Props {
  drivers: DriverOption[];
  depots: DepotOption[];
  events: EventOption[];

  onSearch: (
    filters: SafetyIncidentFilters
  ) => void;
}

export default function SafetyReviewFilters({
  drivers,
  depots,
  events,
  onSearch,
}: Props) {

  const [filters, setFilters] =
    useState<SafetyIncidentFilters>({});
  
  const [driverKeyword, setDriverKeyword] =
  useState("");

  const [showDriverList, setShowDriverList] =
  useState(false);

  function update(
    key: keyof SafetyIncidentFilters,
    value: string
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  }

  function resetFilters() {

    const empty: SafetyIncidentFilters = {};

  setFilters(empty);

  setDriverKeyword("");

  setShowDriverList(false);

  onSearch(empty);

}

  const active =
    "border-blue-500 bg-blue-50";

  const normal =
    "border-slate-300 bg-white";

  return (

    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="grid grid-cols-4 gap-4">

        {/* Driver */}

        <div>

  <label className="mb-2 block text-sm font-medium">
    Driver
  </label>

  <div className="relative">

    <input
      type="text"
      placeholder="Search driver..."
      value={driverKeyword}
      onFocus={() =>
        setShowDriverList(true)
      }
      onChange={(e) => {

        setDriverKeyword(
          e.target.value
        );

        setShowDriverList(true);

      }}
      className={`w-full rounded-lg border p-2 transition ${
        filters.driverId
          ? active
          : normal
      }`}
    />

    {showDriverList && (

      <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">

        <button
          type="button"
          className="block w-full px-3 py-2 text-left hover:bg-slate-100"
          onClick={() => {

            update(
              "driverId",
              ""
            );

            setDriverKeyword("");

            setShowDriverList(false);

          }}
        >
          All Drivers
        </button>

        {drivers
          .filter((driver) => {

            const keyword =
              driverKeyword.toLowerCase();

            return (
              driver.full_name
                .toLowerCase()
                .includes(keyword) ||

              driver.driver_id
                .toLowerCase()
                .includes(keyword)
            );

          })
          .map((driver) => (

            <button
              key={driver.driver_id}
              type="button"
              className="block w-full px-3 py-2 text-left hover:bg-blue-50"
              onClick={() => {

                update(
                  "driverId",
                  driver.driver_id
                );

                setDriverKeyword(
                  `${driver.full_name} (${driver.driver_id})`
                );

                setShowDriverList(false);

              }}
            >

              <div className="font-medium">
                {driver.full_name}
              </div>

              <div className="text-xs text-gray-800">
                {driver.driver_id}
              </div>

            </button>

          ))}

      </div>

    )}

  </div>

</div>

        {/* Vehicle */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Vehicle Plate
          </label>

          <input
            value={filters.vehicleId ?? ""}
            onChange={(e) =>
              update(
                "vehicleId",
                e.target.value
              )
            }
            placeholder="51H-19482"
            className={`w-full rounded-lg border p-2 transition ${
              filters.vehicleId
                ? active
                : normal
            }`}
          />

        </div>

        {/* Depot */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Depot
          </label>

          <select
            value={filters.depotCode ?? ""}
            onChange={(e) =>
              update(
                "depotCode",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 transition ${
              filters.depotCode
                ? active
                : normal
            }`}
          >

            <option value="">
              All Depots
            </option>

            {depots.map((depot) => (

              <option
                key={depot.depot_code}
                value={depot.depot_code}
              >

                {depot.depot_name}

              </option>

            ))}

          </select>

        </div>

        {/* Event */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Event
          </label>

          <select
            value={filters.eventCode ?? ""}
            onChange={(e) =>
              update(
                "eventCode",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 transition ${
              filters.eventCode
                ? active
                : normal
            }`}
          >

            <option value="">
              All Events
            </option>

            {events.map((event) => (

              <option
                key={event.event_code}
                value={event.event_code}
              >

                {event.event_name}

              </option>

            ))}

          </select>

        </div>

        {/* Severity */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Severity
          </label>

          <select
            value={filters.severityCode ?? ""}
            onChange={(e) =>
              update(
                "severityCode",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 transition ${
              filters.severityCode
                ? active
                : normal
            }`}
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

        {/* Review Status */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Review Status
          </label>

          <select
            value={filters.reviewStatus ?? ""}
            onChange={(e) =>
              update(
                "reviewStatus",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 transition ${
              filters.reviewStatus
                ? active
                : normal
            }`}
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

        {/* From */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            From Date
          </label>

          <input
            type="date"
            value={filters.startDate ?? ""}
            onChange={(e) =>
              update(
                "startDate",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 transition ${
              filters.startDate
                ? active
                : normal
            }`}
          />

        </div>

        {/* To */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            To Date
          </label>

          <input
            type="date"
            value={filters.endDate ?? ""}
            onChange={(e) =>
              update(
                "endDate",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 transition ${
              filters.endDate
                ? active
                : normal
            }`}
          />

        </div>

      </div>

      <div className="mt-6 flex justify-between">

        <button
          onClick={resetFilters}
          className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
        >
          Reset Filters
        </button>

        <button
          onClick={() =>
            onSearch(filters)
          }
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>

      </div>

    </div>

  );

}