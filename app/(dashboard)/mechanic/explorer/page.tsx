import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MechanicHistoryTable from "@/components/tables/MechanicHistoryTable";
import MechanicSuggestedJobs from "@/components/tables/MechanicSuggestedJobs";
import { loadAllExplorerJobs, loadSuggestedJobs } from "@/services/dashboard/mechanic";

export default async function MechanicExplorerPage() {
    const myMechanicId = 'MEC1004464';

    const [jobs, suggestedJobs] = await Promise.all([
        loadAllExplorerJobs(),
        loadSuggestedJobs(myMechanicId),
    ]);

    return (
        <>
            <DashboardHeader
                title="Fleet Explorer"
                description="Search and analyze fleet maintenance data (mechanic)."
            />

            <div className="mb-6">
                <MechanicSuggestedJobs mechanicId={myMechanicId} jobs={suggestedJobs as any[]} />
            </div>

            <MechanicHistoryTable
                data={jobs as any[]}
                showSearch={false}
                showFilters
                readOnly={true}
                serverSide={true}
                hideFullName={true}
            />
        </>
    );
}