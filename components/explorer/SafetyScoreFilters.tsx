"use client";

import { useState } from "react";

import {
  DriverOption,
  DepotOption,
  SafetyScoreFilters as SafetyScoreFilterType,
} from "@/types/safety";

interface Props {
  drivers: DriverOption[];
  depots: DepotOption[];

  onSearch: (
    filters: SafetyScoreFilterType
  ) => void;
}

const riskRanges = {
  All: {
    minimumScore: 0,
    maximumScore: 100,
  },

  Excellent: {
    minimumScore: 90,
    maximumScore: 100,
  },

  Good: {
    minimumScore: 75,
    maximumScore: 89,
  },

  Warning: {
    minimumScore: 60,
    maximumScore: 74,
  },

  "High Risk": {
    minimumScore: 0,
    maximumScore: 59,
  },
};

export default function SafetyScoreFilters({
  drivers,
  depots,
  onSearch,
}: Props) {

  const [filters, setFilters] =
    useState<SafetyScoreFilterType>({

      scoreMonth: "2026-02",

      minimumScore: 0,

      maximumScore: 100,

      riskLevel: "All",

    });

  const [driverKeyword, setDriverKeyword] =
    useState("");

  const [showDriverList, setShowDriverList] =
    useState(false);

  function update(
    key: keyof SafetyScoreFilterType,
    value: any
  ) {

    setFilters((prev) => ({
      ...prev,
      [key]:
        value === ""
          ? undefined
          : value,
    }));

  }

  function resetFilters() {

    const reset: SafetyScoreFilterType = {

      scoreMonth: "2026-02",

      minimumScore: 0,

      maximumScore: 100,

      riskLevel: "All",

    };

    setFilters(reset);

    setDriverKeyword("");

    setShowDriverList(false);

    onSearch(reset);

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
              className={`w-full rounded-lg border p-2 ${
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

                      driver.driver_id
                        .toLowerCase()
                        .includes(keyword)

                      ||

                      driver.full_name
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

                      <div className="text-xs text-slate-500">
                        {driver.driver_id}
                      </div>

                    </button>

                  ))}

              </div>

            )}

          </div>

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
            className={`w-full rounded-lg border p-2 ${
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

        {/* Month */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Score Month
          </label>

          <input
            type="month"
            value={
              filters.scoreMonth
            }
            onChange={(e) =>
              update(
                "scoreMonth",
                e.target.value
              )
            }
            className={`w-full rounded-lg border p-2 ${
              filters.scoreMonth
                ? active
                : normal
            }`}
          />

        </div>

        {/* Risk */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Risk Level
          </label>

          <select
            value={
              filters.riskLevel
            }
            onChange={(e) => {

              const risk =
                e.target.value;

              const range =
                riskRanges[
                  risk as keyof typeof riskRanges
                ];

              setFilters((prev) => ({

                ...prev,

                riskLevel: risk,

                minimumScore:
                  range.minimumScore,

                maximumScore:
                  range.maximumScore,

              }));

            }}
            className={`w-full rounded-lg border p-2 ${
              filters.riskLevel !==
              "All"
                ? active
                : normal
            }`}
          >

            <option>
              All
            </option>

            <option>
              Excellent
            </option>

            <option>
              Good
            </option>

            <option>
              Warning
            </option>

            <option>
              High Risk
            </option>

          </select>

        </div>

        {/* Minimum */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Minimum Score
          </label>

          <input
            type="number"
            min={0}
            max={100}
            value={
              filters.minimumScore
            }
            onChange={(e) =>
              update(
                "minimumScore",
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-lg border p-2"
          />

        </div>

        {/* Maximum */}

        <div>

          <label className="mb-2 block text-sm font-medium">
            Maximum Score
          </label>

          <input
            type="number"
            min={0}
            max={100}
            value={
              filters.maximumScore
            }
            onChange={(e) =>
              update(
                "maximumScore",
                Number(
                  e.target.value
                )
              )
            }
            className="w-full rounded-lg border p-2"
          />

        </div>

      </div>

      <div className="mt-6 flex justify-between">

        <button
          onClick={resetFilters}
          className="rounded-lg border px-5 py-2 hover:bg-slate-100"
        >
          Reset Filters
        </button>

        <button
          onClick={() =>
            onSearch(filters)
          }
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>

      </div>

    </div>

  );

}