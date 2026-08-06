'use client';

export default function MechanicCertificationsTable({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-4 rounded shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">My Certifications</h2>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="p-2">Mechanic ID</th>
                        <th className="p-2">Full Name</th>
                        <th className="p-2">Certification</th>
                        <th className="p-2">Issue Date</th>
                        <th className="p-2">Expire Date</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="p-2">{row.mechanic_id}</td>
                            <td className="p-2">{row.full_name}</td>
                            <td className="p-2">{row.certification_name}</td>
                            <td className="p-2">{row.issue_date ? new Date(row.issue_date).toLocaleDateString() : 'N/A'}</td>
                            <td className="p-2 font-semibold text-red-500">
                                {row.expire_date ? new Date(row.expire_date).toLocaleDateString() : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}