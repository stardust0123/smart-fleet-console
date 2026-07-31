import DashboardCard from "./DashboardCard";

const vehicles = [
  {
    id: "TRK-001",
    type: "Truck",
    driver: "John Smith",
    depot: "North Depot",
    status: "Active",
    trips: 128,
    lastService: "12 Jul 2026",
  },
  {
    id: "TRK-008",
    type: "Truck",
    driver: "Emily Brown",
    depot: "East Depot",
    status: "Maintenance",
    trips: 84,
    lastService: "18 Jul 2026",
  },
  {
    id: "VAN-014",
    type: "Van",
    driver: "Michael Lee",
    depot: "South Depot",
    status: "Inactive",
    trips: 52,
    lastService: "03 Jul 2026",
  },
  {
    id: "TRK-021",
    type: "Truck",
    driver: "Sarah Wilson",
    depot: "West Depot",
    status: "Active",
    trips: 156,
    lastService: "22 Jul 2026",
  },
  {
    id: "BUS-004",
    type: "Bus",
    driver: "David Miller",
    depot: "North Depot",
    status: "Active",
    trips: 97,
    lastService: "15 Jul 2026",
  },
];

function badge(status: string) {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700";

    case "Maintenance":
      return "bg-amber-100 text-amber-700";

    case "Inactive":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function ExplorerTable() {
  return (
    <DashboardCard>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Query Results
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing 5 matching vehicles
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-200">
            <tr className="text-left text-sm text-slate-500">
              <th className="pb-4 font-medium">Vehicle</th>
              <th className="pb-4 font-medium">Type</th>
              <th className="pb-4 font-medium">Driver</th>
              <th className="pb-4 font-medium">Depot</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium text-right">Trips</th>
              <th className="pb-4 font-medium">Last Service</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-4 font-semibold text-slate-900">
                  {vehicle.id}
                </td>

                <td className="py-4 text-slate-600">
                  {vehicle.type}
                </td>

                <td className="py-4 text-slate-600">
                  {vehicle.driver}
                </td>

                <td className="py-4 text-slate-600">
                  {vehicle.depot}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${badge(
                      vehicle.status
                    )}`}
                  >
                    {vehicle.status}
                  </span>
                </td>

                <td className="py-4 text-right font-medium text-slate-700">
                  {vehicle.trips}
                </td>

                <td className="py-4 text-slate-500">
                  {vehicle.lastService}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
