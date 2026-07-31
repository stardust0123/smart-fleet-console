import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExplorerFilters from "@/components/dashboard/ExplorerFilters";
import ExplorerTable from "@/components/dashboard/ExplorerTable";

export default function ExplorerPage() {
  return (
    <>
      <DashboardHeader
        title="Fleet Explorer"
        description="Search and analyze fleet data using custom filters."
      />

      <ExplorerFilters />

      <div className="mt-6">
        <ExplorerTable />
      </div>
    </>
  );
}
