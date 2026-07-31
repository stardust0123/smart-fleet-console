import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExplorerFilters from "./ExplorerFilters";
import ExplorerTable from "./ExplorerTable";

interface ExplorerPageProps {
  role: "manager" | "mechanic" | "safety" | "driver";
}

export default function ExplorerPage({
  role,
}: ExplorerPageProps) {
  return (
    <>
      <DashboardHeader
        title="Fleet Explorer"
        description={`Search and analyze fleet data (${role}).`}
      />

      <ExplorerFilters />

      <div className="mt-6">
        <ExplorerTable />
      </div>
    </>
  );
}