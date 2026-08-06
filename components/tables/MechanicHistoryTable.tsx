'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { changeJobStatus, loadAllExplorerJobsFiltered } from '@/services/dashboard/mechanic';

interface MechanicHistoryTableProps {
    data?: any[];
    showSearch?: boolean;
    showFilters?: boolean;
    readOnly?: boolean;
    limit?: number;
    title?: string;
    subtitle?: string;
    serverSide?: boolean;   // NEW: bật lọc qua SQL WHERE thay vì client-side
    hideFullName?: boolean; // NEW: ẩn cột + filter full_name (dùng cho Explorer)
}

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    InProgress: 'bg-blue-100 text-blue-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
};

const EMPTY_FILTERS = {
    register_number: '',
    model: '',
    mechanic_id: '',
    full_name: '',
    activity_code: '',
    job_status: '',
};

export default function MechanicHistoryTable({
    data: initialData = [],
    showSearch = true,
    showFilters = false,
    readOnly = false,
    limit,
    title = 'Maintenance History & Active Jobs',
    subtitle,
    serverSide = false,
    hideFullName = false,
}: MechanicHistoryTableProps) {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [serverData, setServerData] = useState(initialData);
    const [isPending, startTransition] = useTransition();

    function normalizeVN(str: string) {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase();
    }

    // --- Server-side mode: debounce rồi gọi lại SQL WHERE ---
    useEffect(() => {
        if (!serverSide) return;
        const timer = setTimeout(() => {
            startTransition(async () => {
                const rows = await loadAllExplorerJobsFiltered({
                    register_number: filters.register_number || search,
                    model: filters.model,
                    mechanic_id: filters.mechanic_id,
                    activity_code: filters.activity_code,
                    job_status: filters.job_status,
                });
                setServerData(rows as any[]);
            });
        }, 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serverSide, search, filters]);

    // --- Client-side mode (giữ nguyên hành vi cũ cho Dashboard) ---
    const clientFilteredData = useMemo(() => {
        if (serverSide) return initialData; // không dùng nhánh này khi serverSide
        return (initialData || []).filter((item) => {
            const matchesSearch =
                !search ||
                normalizeVN(String(item.register_number ?? '')).includes(normalizeVN(search)) ||
                normalizeVN(String(item.model ?? '')).includes(normalizeVN(search));

            const matchesFilters = Object.entries(filters).every(([key, val]) => {
                if (hideFullName && key === 'full_name') return true;
                const needle = normalizeVN(val.trim());
                if (!needle) return true;
                const cell = normalizeVN(String(item[key] ?? ''));
                return cell.includes(needle);
            });

            return matchesSearch && matchesFilters;
        });
    }, [initialData, search, filters, serverSide, hideFullName]);

    const effectiveData = serverSide ? serverData : clientFilteredData;
    const rows = limit ? effectiveData.slice(0, limit) : effectiveData;

    const handleUpdateStatus = async (jobId: string, status: string) => {
        if (!jobId) return;
        setLoadingId(jobId);
        await changeJobStatus(jobId, status);
        setLoadingId(null);
    };

    const resetFilters = () => {
        setFilters(EMPTY_FILTERS);
        setSearch('');
    };

    const hasMechanicColumns = (initialData || []).some((r) => 'mechanic_id' in r || 'full_name' in r);
    const showFullNameColumn = hasMechanicColumns && !hideFullName;
    const hasCloseDate = (initialData || []).some((r) => 'close_date' in r);

    const colSpan =
        2 + // Reg. Number + Model
        (hasMechanicColumns ? 1 : 0) + // Mechanic ID (luôn hiện nếu có mechanic columns)
        (showFullNameColumn ? 1 : 0) + // Mechanic Name (chỉ hiện nếu không hideFullName)
        1 + // Open Date
        (hasCloseDate ? 1 : 0) +
        2 + // Activity + Status
        (!readOnly ? 1 : 0);

    return (
        <div className="rounded-2xl border bg-white shadow-sm flex flex-col w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-6 gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {subtitle ?? `${effectiveData.length} records found`}
                        {isPending && <span className="ml-2 text-xs text-blue-500">Đang lọc...</span>}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search Reg No or Model..."
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-blue-500 min-w-[220px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    )}
                    {(showSearch || showFilters) && (
                        <button
                            onClick={resetFilters}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-6 py-4 border-b bg-slate-50/50">
                    <input
                        placeholder="Reg. Number"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                        value={filters.register_number}
                        onChange={(e) => setFilters((f) => ({ ...f, register_number: e.target.value }))}
                    />
                    <input
                        placeholder="Model"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                        value={filters.model}
                        onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
                    />
                    {hasMechanicColumns && (
                        <>
                            <input
                                placeholder="Mechanic ID"
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                                value={filters.mechanic_id}
                                onChange={(e) => setFilters((f) => ({ ...f, mechanic_id: e.target.value }))}
                            />
                            {!hideFullName && (
                                <input
                                    placeholder="Mechanic Name"
                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                                    value={filters.full_name}
                                    onChange={(e) => setFilters((f) => ({ ...f, full_name: e.target.value }))}
                                />
                            )}
                        </>
                    )}
                    <input
                        placeholder="Activity"
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                        value={filters.activity_code}
                        onChange={(e) => setFilters((f) => ({ ...f, activity_code: e.target.value }))}
                    />
                    <select
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                        value={filters.job_status}
                        onChange={(e) => setFilters((f) => ({ ...f, job_status: e.target.value }))}
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            )}

            <div className={`overflow-x-auto overflow-y-auto rounded-b-2xl ${limit ? '' : 'max-h-[400px]'}`}>
                <table className="min-w-full text-left relative">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr className="text-sm text-slate-600 border-b">
                            <th className="px-6 py-4 font-medium bg-slate-50">Reg. Number</th>
                            <th className="px-6 py-4 font-medium bg-slate-50">Model</th>
                            {hasMechanicColumns && (
                                <>
                                    <th className="px-6 py-4 font-medium bg-slate-50">Mechanic ID</th>
                                    {showFullNameColumn && (
                                        <th className="px-6 py-4 font-medium bg-slate-50">Mechanic Name</th>
                                    )}
                                </>
                            )}
                            <th className="px-6 py-4 font-medium bg-slate-50">Open Date</th>
                            {hasCloseDate && (
                                <th className="px-6 py-4 font-medium bg-slate-50">End Date</th>
                            )}
                            <th className="px-6 py-4 font-medium bg-slate-50">Activity</th>
                            <th className="px-6 py-4 font-medium bg-slate-50">Status</th>
                            {!readOnly && (
                                <th className="px-6 py-4 font-medium bg-slate-50">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={colSpan} className="px-6 py-8 text-center text-sm text-slate-400">
                                    No records found
                                </td>
                            </tr>
                        )}
                        {rows.map((row, idx) => (
                            <tr key={row.job_id ? `${row.job_id}-${idx}` : idx} className="border-b last:border-0 hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{row.register_number}</td>
                                <td className="px-6 py-4">{row.model}</td>
                                {hasMechanicColumns && (
                                    <>
                                        <td className="px-6 py-4">{row.mechanic_id ?? '—'}</td>
                                        {showFullNameColumn && (
                                            <td className="px-6 py-4">{row.full_name ?? '—'}</td>
                                        )}
                                    </>
                                )}
                                <td className="px-6 py-4 text-slate-500">
                                    {row.open_date ? new Date(row.open_date).toLocaleDateString('en-GB') : 'N/A'}
                                </td>
                                {hasCloseDate && (
                                    <td className="px-6 py-4 text-slate-500">
                                        {row.close_date ? new Date(row.close_date).toLocaleDateString('en-GB') : 'N/A'}
                                    </td>
                                )}
                                <td className="px-6 py-4">{row.activity_name ?? row.activity_code}</td>
                                <td className="px-6 py-4">
                                    {row.job_status ? (
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[row.job_status] ?? 'bg-slate-100 text-slate-700'}`}>
                                            {row.job_status}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-xs">N/A</span>
                                    )}
                                </td>
                                {!readOnly && (
                                    <td className="px-6 py-4 space-x-2 flex">
                                        {row.job_id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(row.job_id, 'Pending')}
                                                    disabled={loadingId === row.job_id}
                                                    className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium disabled:opacity-50 hover:bg-yellow-200"
                                                >
                                                    Pending
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(row.job_id, 'InProgress')}
                                                    disabled={loadingId === row.job_id}
                                                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium disabled:opacity-50 hover:bg-blue-200"
                                                >
                                                    In Progress
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(row.job_id, 'Completed')}
                                                    disabled={loadingId === row.job_id}
                                                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium disabled:opacity-50 hover:bg-green-200"
                                                >
                                                    Complete
                                                </button>
                                            </>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">Read-only</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}