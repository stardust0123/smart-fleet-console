import {
  Activity,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

export default function FleetIllustration() {
  return (
    <section
      className="
        relative
        flex
        h-full
        w-full
        flex-col
        justify-between
        overflow-hidden
        bg-gradient-to-br
        from-blue-900
        via-blue-700
        to-cyan-500
        p-16
        text-white
      "
    >
      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* Hero */}
      <div className="relative z-10 max-w-lg">
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
          Smart Fleet Management
        </span>

        <h1 className="mt-8 text-5xl font-bold leading-tight">
          Monitor Your Fleet
          <br />
          In Real Time.
        </h1>

        <p className="mt-6 text-lg leading-8 text-blue-100">
          Manage vehicles, drivers, maintenance, and operations
          through one centralized dashboard designed for modern
          logistics companies.
        </p>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 grid grid-cols-2 gap-5">
        <Feature
          icon={<Truck className="h-6 w-6" />}
          title="Fleet Tracking"
          description="Track every vehicle live."
        />

        <Feature
          icon={<Activity className="h-6 w-6" />}
          title="Analytics"
          description="Visualize operational insights."
        />

        <Feature
          icon={<Wrench className="h-6 w-6" />}
          title="Maintenance"
          description="Prevent unexpected downtime."
        />

        <Feature
          icon={<ShieldCheck className="h-6 w-6" />}
          title="Safety"
          description="Monitor driver compliance."
        />
      </div>
    </section>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({
  icon,
  title,
  description,
}: FeatureProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition hover:bg-white/20">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
        {icon}
      </div>

      <h3 className="font-semibold">{title}</h3>

      <p className="mt-2 text-sm text-blue-100">
        {description}
      </p>
    </div>
  );
}