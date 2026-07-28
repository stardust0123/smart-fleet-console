"use client";

import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    // TODO:
    // Replace with NextAuth/Auth.js/Backend API

    await new Promise((resolve) => setTimeout(resolve, 1200));

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-12 space-y-8"
    >
      {/* Email */}

      <div>
        <label
          htmlFor="email"
          className="text-sm font-semibold text-slate-800"
        >
          Company Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="john@smartfleet.com"
          autoComplete="email"
          className="
            mt-3
            w-full

            border-0
            border-b-2
            border-slate-200

            bg-transparent

            py-3

            text-slate-900
            placeholder:text-slate-400

            outline-none

            transition-all
            duration-200

            focus:border-blue-600
          "
        />
      </div>

      {/* Password */}

      <div>
        <label
          htmlFor="password"
          className="text-sm font-semibold text-slate-800"
        >
          Password
        </label>

        <div className="relative mt-3">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            className="
              w-full

              border-0
              border-b-2
              border-slate-200

              bg-transparent

              py-3
              pr-10

              text-slate-900

              outline-none

              transition-all
              duration-200

              focus:border-blue-600
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              absolute
              right-0
              top-1/2
              -translate-y-1/2

              text-slate-400

              transition

              hover:text-slate-700
            "
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Options */}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            className="
              h-4
              w-4

              rounded

              border-slate-300

              accent-blue-600
            "
          />

          Remember me
        </label>

        <button
          type="button"
          className="
            text-sm
            font-medium
            text-blue-600

            transition

            hover:text-blue-700
          "
        >
          Forgot password?
        </button>
      </div>

      {/* Button */}

      <button
        type="submit"
        disabled={loading}
        className="
          flex
          h-12
          w-full
          items-center
          justify-center

          rounded-xl

          bg-blue-600

          font-semibold
          text-white

          transition-all
          duration-200

          hover:bg-blue-700

          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}