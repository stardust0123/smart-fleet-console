'use server';

import {
    getVehicleMaintenanceHistory,
    getDiagnosticRecords,
    getPreviousRepairInfo,
    getMechanicCertifications,
    getMechanicHistoricalJobs,
    updateMaintenanceJobStatus,
    getCompletedJobsByMechanic,
    getMechanicTotalLabourHours,
    getMechanicAssignedJobsFull,
    getSuggestedJobsForMechanic,
    assignMechanicToActivity,
    getAllAssignedJobsFull,
    getAllAssignedJobsFiltered,
} from '@/repositories/dashboard/mechanic';
import { revalidatePath } from 'next/cache';

export async function loadMechanicDashboard(mechanicId: string) {
    const [
        history,
        diagnostics,
        repairs,
        certifications,
        historicalJobs,
        completedJobs,
        labourHours,
    ] = await Promise.all([
        getVehicleMaintenanceHistory(),
        getDiagnosticRecords(),
        getPreviousRepairInfo(),
        getMechanicCertifications(mechanicId),
        getMechanicHistoricalJobs(mechanicId),
        getCompletedJobsByMechanic(mechanicId),
        getMechanicTotalLabourHours(mechanicId),
    ]);

    const historyRows = history as any[];
    const diagnosticRows = diagnostics as any[];
    const certificationRows = certifications as any[];
    const jobRows = historicalJobs as any[];
    const completedJobRows = completedJobs as any[];

    const stats = {
        totalCertifications: certificationRows.length,
        totalHistoricalJobs: jobRows.length,
        totalDiagnostics: diagnosticRows.length,
        pendingJobs: jobRows.filter((j) => j.job_status === 'Pending').length,
        totalLabourHours: labourHours?.total_labour_hours ?? 0,
    };

    const statusCounts: Record<string, number> = {};
    for (const job of jobRows) {
        const key = job.job_status || 'Unknown';
        statusCounts[key] = (statusCounts[key] || 0) + 1;
    }
    const jobStatusChart = Object.entries(statusCounts).map(([status, total]) => ({
        status,
        total,
    }));

    const activityCounts: Record<string, number> = {};
    for (const d of diagnosticRows) {
        const key = d.activity_name || 'Unspecified';
        activityCounts[key] = (activityCounts[key] || 0) + 1;
    }
    const diagnosticChart = Object.entries(activityCounts)
        .map(([activity_name, total]) => ({ activity_name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 6);

    const now = Date.now();
    const soon = 1000 * 60 * 60 * 24 * 90;
    const expiringSoon = certificationRows.filter((c) => {
        if (!c.expire_date) return false;
        const diff = new Date(c.expire_date).getTime() - now;
        return diff >= 0 && diff <= soon;
    }).length;

    const jobInfoByJobId = new Map(historyRows.map((h) => [h.job_id, h]));
    const myPendingJobs = jobRows
        .filter((j) => j.job_status !== 'Completed')
        .slice(0, 5)
        .map((j) => {
            const info = jobInfoByJobId.get(j.job_id);
            return {
                job_id: j.job_id,
                job_status: j.job_status,
                open_date: j.open_date,
                register_number: info?.register_number ?? '—',
                model: info?.model ?? '—',
                activity_name: info?.activity_name ?? '—',
            };
        });

    return {
        stats: { ...stats, expiringSoon },
        history: historyRows,
        diagnostics: diagnosticRows,
        repairs: repairs as any[],
        certifications: certificationRows,
        historicalJobs: jobRows,
        jobStatusChart,
        diagnosticChart,
        myPendingJobs,
        completedJobs: completedJobRows,
    };
}

export async function changeJobStatus(jobId: string, newStatus: string) {
    const result = await updateMaintenanceJobStatus(jobId, newStatus);
    revalidatePath('/mechanic');
    revalidatePath('/mechanic/explorer');
    return result;
}

export async function loadExplorerJobs(mechanicId: string) {
    return getMechanicAssignedJobsFull(mechanicId);
}

export async function loadAllExplorerJobsFiltered(filters: {
    register_number?: string;
    model?: string;
    mechanic_id?: string;
    activity_code?: string;
    job_status?: string;
}) {
    return getAllAssignedJobsFiltered(filters);
}

export async function loadSuggestedJobs(mechanicId: string) {
    return getSuggestedJobsForMechanic(mechanicId);
}

export async function takeSuggestedJob(mechanicId: string, activityId: string, labourHours: number = 0) {
    const result = await assignMechanicToActivity(mechanicId, activityId, labourHours);
    revalidatePath('/mechanic');
    revalidatePath('/mechanic/explorer');
    return result;
}

export async function loadAllExplorerJobs() {
    return getAllAssignedJobsFull();
}