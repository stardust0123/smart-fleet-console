import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <Topbar />

        <section className="flex-1 overflow-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
}