"use client";

interface Props {
  severity: string;
}

export default function RiskBadge({
  severity,
}: Props) {
  const config = {
    LOW: {
      bg: "bg-green-100",
      text: "text-green-700",
    },

    MED: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },

    HIGH: {
      bg: "bg-orange-100",
      text: "text-orange-700",
    },

    CRIT: {
      bg: "bg-red-100",
      text: "text-red-700",
    },
  } as const;

  const style =
    config[
      severity as keyof typeof config
    ] ?? {
      bg: "bg-slate-100",
      text: "text-black",
    };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {severity}
    </span>
  );
}