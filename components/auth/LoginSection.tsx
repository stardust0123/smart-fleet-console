import Logo from "./Logo";
import LoginForm from "./LoginForm";

export default function LoginSection() {
  return (
    <section
      className="
        flex
        h-full
        items-center
        justify-center
        px-14
      "
    >
      <div className="w-full max-w-md">

        <Logo />

        <div className="mt-16">

          <h1 className="text-5xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-5 leading-8 text-gray-800">
            Sign in with your company account to access
            your fleet operations dashboard.
          </p>
          <LoginForm />
        </div>

      </div>
    </section>
  );
}