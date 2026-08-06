import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { loadDriverHistory } from "@/services/dashboard/driver";
import DriverHistoryTabs from "@/components/tables/DriverHistoryTabs";

function extractDriverId(email: string): string {
  return email.split("@")[0].toUpperCase();
}

export default async function DriverHistoryPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let driverId = "";
  if (token) {
    try {
      const payload = await verifyToken(token);
      driverId = extractDriverId(String(payload.email ?? ""));
    } catch {
      driverId = "";
    }
  }

  const { trips, maintenance, violations, coaching } =
    await loadDriverHistory(driverId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Driver History</h1>

      <DriverHistoryTabs
        trips={trips}
        maintenance={maintenance}
        violations={violations}
        coaching={coaching}
      />
    </div>
  );
}