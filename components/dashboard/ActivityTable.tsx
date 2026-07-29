import DashboardCard from "./DashboardCard";

const activities = [
  {
    vehicle: "Truck-102",
    driver: "John Smith",
    status: "Completed",
    date: "Today",
  },
  {
    vehicle: "Truck-087",
    driver: "Emily Brown",
    status: "Maintenance",
    date: "Yesterday",
  },
  {
    vehicle: "Van-041",
    driver: "Michael Lee",
    status: "In Transit",
    date: "Yesterday",
  },
  {
    vehicle: "Truck-019",
    driver: "Sophia Davis",
    status: "Completed",
    date: "2 days ago",
  },
  {
    vehicle: "Truck-110",
    driver: "Daniel Wilson",
    status: "Delayed",
    date: "2 days ago",
  },
];

function getBadge(status: string) {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-700";

    case "Maintenance":
      return "bg-orange-100 text-orange-700";

    case "Delayed":
      return "bg-red-100 text-red-700";

    default:
      return "bg-blue-100 text-blue-700";
  }
}

export default function ActivityTable() {
  return (
    <DashboardCard>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Fleet Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest operations across the fleet
          </p>
        </div>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
              <th className="pb-4 font-medium">Vehicle</th>
              <th className="pb-4 font-medium">Driver</th>
              <th className="pb-4 font-medium">Status</th>
              <th className="pb-4 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-4 font-medium text-slate-800">
                  {activity.vehicle}
                </td>

                <td className="py-4 text-slate-600">
                  {activity.driver}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getBadge(
                      activity.status
                    )}`}
                  >
                    {activity.status}
                  </span>
                </td>

                <td className="py-4 text-slate-500">
                  {activity.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}