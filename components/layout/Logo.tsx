import { Truck } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 px-6 py-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
        <Truck className="h-5 w-5" />
      </div>

      <div>
        <h1 className="font-bold text-slate-900">
          Smart Fleet
        </h1>

        <p className="text-xs text-slate-500">
          Management Console
        </p>
      </div>
    </div>
  );
}