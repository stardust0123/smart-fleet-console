import {
  Bell,
  CircleUser,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <CircleUser className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
}

