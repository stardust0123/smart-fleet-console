import FleetIllustration from "@/components/illustration/FleetIllustration";
import LoginSection from "@/components/auth/LoginSection";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section
        className="
          mx-auto
          flex
          min-h-[calc(100vh-48px)]
          max-w-7xl
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >
        {/* Left */}

        <div className="hidden w-3/5 lg:flex">
          <FleetIllustration />
        </div>

        {/* Right */}

        <div className="w-full lg:w-2/5">
          <LoginSection />
        </div>
      </section>
    </main>
  );
}