'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { takeSuggestedJob } from '@/services/dashboard/mechanic';

interface SuggestedJob {
    job_id: string;
    activity_id: string;
    register_number: string;
    model: string;
    activity_name: string;
    certification_name: string;
    job_status: string;
}

interface Props {
    mechanicId: string;
    jobs: SuggestedJob[];
}

export default function MechanicSuggestedJobs({ mechanicId, jobs }: Props) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    // Optimistically hide taken jobs without waiting for the server refetch
    const [takenIds, setTakenIds] = useState<Set<string>>(new Set());

    const visibleJobs = jobs.filter((j) => !takenIds.has(j.activity_id));

    const handleTake = async (activityId: string) => {
        setLoadingId(activityId);
        setMessage(null);
        try {
            await takeSuggestedJob(mechanicId, activityId);
            setTakenIds((prev) => new Set(prev).add(activityId));
            setMessage('Job assigned to you. Check "My Active Jobs" on the Dashboard.');
            router.refresh(); // re-fetch server data for this page + revalidated paths
        } catch {
            setMessage('Failed to assign job.');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">Suggested Jobs For You</h2>
            <p className="mt-1 mb-4 text-sm text-gray-800">
                Pending, unassigned jobs matching your certifications.
            </p>

            {visibleJobs.length === 0 ? (
                <p className="text-sm text-gray-700">No matching jobs right now.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="text-sm text-gray-800 border-b">
                                <th className="px-4 py-2 font-medium">Reg. Number</th>
                                <th className="px-4 py-2 font-medium">Model</th>
                                <th className="px-4 py-2 font-medium">Activity</th>
                                <th className="px-4 py-2 font-medium">Certification</th>
                                <th className="px-4 py-2 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleJobs.map((j) => (
                                <tr key={j.activity_id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="px-4 py-2 font-medium">{j.register_number}</td>
                                    <td className="px-4 py-2">{j.model}</td>
                                    <td className="px-4 py-2">{j.activity_name}</td>
                                    <td className="px-4 py-2">{j.certification_name}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleTake(j.activity_id)}
                                            disabled={loadingId === j.activity_id}
                                            className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium disabled:opacity-50 hover:bg-blue-700"
                                        >
                                            {loadingId === j.activity_id ? 'Taking...' : 'Take Job'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {message && <p className="mt-3 text-sm text-gray-800">{message}</p>}
        </div>
    );
}