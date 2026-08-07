"use client";

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";

import { SeverityDistribution } from "@/types/dashboard";

interface Props {

  data: SeverityDistribution[];

}

const colors = {

  LOW: "#BBF7D0",

  MED: "#FEF08A",

  HIGH: "#FED7AA",

  CRIT: "#FECACA",

};
export default function IncidentSeverityChart({
  data,
}: Props) {

  return (

    <div className="flex h-full flex-col rounded-xl border bg-white shadow-sm">

      <div className="border-b px-6 py-4">

        <h2 className="text-lg font-semibold">

          Incident Severity

        </h2>

        <p className="text-sm text-gray-800">

          Distribution of incidents by severity.

        </p>

      </div>

      <div className="flex-1 p-6">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={data}
            layout="vertical"
            margin={{
              left: 10,
              right: 20,
            }}
          >

            <XAxis
              type="number"
            />

            <YAxis
              type="category"
              dataKey="severity_code"
            />

            <Tooltip />

            <Bar
              dataKey="total"
              radius={[0, 8, 8, 0]}
            >

              {data.map((item) => (

                <Cell
                  key={item.severity_code}
                  fill={
                    colors[
                      item.severity_code as keyof typeof colors
                    ]
                  }
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}