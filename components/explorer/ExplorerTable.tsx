interface Vehicle {
  vehicleId: string;
  registration: string;
  manufacturer: string;
  model: string;
  year: number;
  depot: string;
  status: string;
}

const sampleVehicles: Vehicle[] = [
  {
    vehicleId: "VH001",
    registration: "51A-12345",
    manufacturer: "Toyota",
    model: "Hiace",
    year: 2024,
    depot: "North Depot",
    status: "Available",
  },
  {
    vehicleId: "VH002",
    registration: "51A-67890",
    manufacturer: "Ford",
    model: "Transit",
    year: 2023,
    depot: "South Depot",
    status: "Maintenance",
  },
  {
    vehicleId: "VH003",
    registration: "51A-11111",
    manufacturer: "Mercedes",
    model: "Sprinter",
    year: 2025,
    depot: "East Depot",
    status: "In Service",
  },
];

interface ExplorerTableProps {
  data?: Vehicle[];
}

export default function ExplorerTable({
  data = sampleVehicles,
}: ExplorerTableProps) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-lg font-semibold">
          Query Results
        </h2>

        <p className="mt-1 text-sm text-gray-800">
          {data.length} vehicles found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-gray-800">
              <th className="px-6 py-4">Vehicle ID</th>
              <th className="px-6 py-4">Registration</th>
              <th className="px-6 py-4">Manufacturer</th>
              <th className="px-6 py-4">Model</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Depot</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((vehicle) => (
              <tr
                key={vehicle.vehicleId}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">
                  {vehicle.vehicleId}
                </td>

                <td className="px-6 py-4">
                  {vehicle.registration}
                </td>

                <td className="px-6 py-4">
                  {vehicle.manufacturer}
                </td>

                <td className="px-6 py-4">
                  {vehicle.model}
                </td>

                <td className="px-6 py-4">
                  {vehicle.year}
                </td>

                <td className="px-6 py-4">
                  {vehicle.depot}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={vehicle.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const colors: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    "In Service": "bg-blue-100 text-blue-700",
    Maintenance: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[status] ??
        "bg-slate-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}