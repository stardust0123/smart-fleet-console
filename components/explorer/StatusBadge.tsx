"use client";

interface Props {
  status: string;
}

export default function StatusBadge({
  status,
}: Props) {
  const config = {
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },

    "In Progress": {
      bg: "bg-blue-100",
      text: "text-blue-700",
    },

    Completed: {
      bg: "bg-green-100",
      text: "text-green-700",
    },
  } as const;

  const style =
    config[
      status as keyof typeof config
    ] ?? {
      bg: "bg-slate-100",
      text: "text-slate-700",
    };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {status}
    </span>
  );
}