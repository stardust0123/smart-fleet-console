import { Truck } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-4">

      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-blue-600
          text-white
        "
      >
        <Truck size={28} />
      </div>

      <div>

        <h2 className="text-2xl font-bold text-gray-900">
          Smart Fleet
        </h2>

        <p className="text-sm text-gray-800">
          Fleet Management Console
        </p>

      </div>

    </div>
  );
}