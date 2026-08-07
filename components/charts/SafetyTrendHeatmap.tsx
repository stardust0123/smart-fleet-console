"use client";

import { SafetyTrend } from "@/types/dashboard";

interface Props {
  data: SafetyTrend[];
}

const eventNames: Record<string, string> = {
  ACL: "Rapid Acceleration",
  BRK: "Harsh Braking",
  FTG: "Fatigue Warning",
  IDL: "Excessive Idling",
  PHO: "Phone Distraction",
  SB: "Seatbelt Violation",
  SCN: "Sharp Cornering",
  SPD: "Excessive Speeding",
};

const depots = [
  "D-001",
  "D-002",
  "D-003",
  "D-004",
];

const events = [
  "ACL",
  "BRK",
  "FTG",
  "IDL",
  "PHO",
  "SB",
  "SCN",
  "SPD",
];

function getColor(value: number) {

  if (value >= 50)
    return "bg-red-200";

if (value >= 30)
    return "bg-orange-200";

if (value >= 15)
    return "bg-yellow-200";

if (value >= 1)
    return "bg-green-200";

return "bg-slate-100";
}

export default function SafetyTrendHeatmap({
  data,
}: Props) {

  const lookup = Object.fromEntries(
    data.map((row) => [
      row.depot_code,
      row,
    ])
  );

  return (

    <div className="rounded-xl border bg-white shadow-sm">

      <div className="border-b px-6 py-4">

        <h2 className="text-lg font-semibold">

          Safety Event Heatmap

        </h2>

        <p className="text-sm text-black">

          Compare safety events across depots.

        </p>

      </div>

      <div className="overflow-x-auto p-6">

        <table className="min-w-full border-collapse">

          <thead>

            <tr>

              <th className="w-64 px-4 py-3 text-left">

                Event Type

              </th>

              {depots.map((depot) => (

                <th
                  key={depot}
                  className="px-4 py-3 text-center"
                >

                  {depot}

                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {events.map((event) => (

              <tr
                key={event}
                className="border-t"
              >

                <td className="px-4 py-4 font-medium">

                  {eventNames[event]}

                </td>

                {depots.map((depot) => {

                  const row =
                    lookup[depot];

                  const value =
                    row
                      ? Number(
                          row[
                            event as keyof SafetyTrend
                          ]
                        )
                      : 0;

                  return (

                    <td
                      key={depot}
                      className="p-2"
                    >

                      <div
                        title={`${eventNames[event]}
${depot}
${value} incidents`}
                        className={`flex h-14 w-full items-center justify-center rounded-lg text-sm font-bold transition hover:scale-105 ${getColor(
                          value
                        )}`}
                      >

                        {value}

                      </div>

                    </td>

                  );

                })}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex gap-6 border-t px-6 py-4 text-sm">

        <div className="flex items-center gap-2">

          <div className="h-4 w-4 rounded bg-slate-100" />

          0

        </div>

        <div className="flex items-center gap-2">

          <div className="h-4 w-4 rounded bg-green-300" />

          1–14

        </div>

        <div className="flex items-center gap-2">

          <div className="h-4 w-4 rounded bg-yellow-300" />

          15–29

        </div>

        <div className="flex items-center gap-2">

          <div className="h-4 w-4 rounded bg-orange-500" />

          30–49

        </div>

        <div className="flex items-center gap-2">

          <div className="h-4 w-4 rounded bg-red-600" />

          ≥ 50

        </div>

      </div>

    </div>

  );

}