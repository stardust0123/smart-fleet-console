"use client";

type Certification = {
  credential_id: string;
  credential_name: string;
  credential_type: string;
  issue_date: string;
  expire_date: string;
};

function formatDate(value: string): string {
  const d = new Date(value);
  return d.toLocaleDateString("en-GB");
}

function isExpired(expireDate: string): boolean {
  return new Date(expireDate) < new Date();
}

export default function DriverCertificationsTable({
  certifications,
}: {
  certifications: Certification[];
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Certifications & Licences
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">Name</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Issue Date</th>
              <th className="pb-2">Expire Date</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map((c) => {
              const expired = isExpired(c.expire_date);
              return (
                <tr key={c.credential_id} className="border-t">
                  <td className="py-2 font-medium text-slate-900">
                    {c.credential_name}
                  </td>
                  <td className="py-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {c.credential_type}
                    </span>
                  </td>
                  <td className="py-2">{formatDate(c.issue_date)}</td>
                  <td className="py-2">{formatDate(c.expire_date)}</td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        expired
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {expired ? "Expired" : "Valid"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}