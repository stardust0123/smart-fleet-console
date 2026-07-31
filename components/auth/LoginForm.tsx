"use client";

import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      switch (data.user.role) {
        case "OWNER":
          router.push("/owner");
          break;

        case "MANAGER":
          router.push("/manager");
          break;

        case "MECHANIC":
          router.push("/mechanic");
          break;

        case "SAFETY":
          router.push("/safety");
          break;

        case "DRIVER":
          router.push("/driver");
          break;

        default:
          router.push("/");
      }
    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-12 space-y-8"
    >
      <div>
        <label className="text-sm font-semibold">
          Company Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="role@smartfleet.com"
          className="mt-3 w-full border-b-2 border-slate-200 bg-transparent py-3 outline-none focus:border-blue-600"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">
          Password
        </label>

        <div className="relative mt-3">
          <input
            type={
              showPassword ? "text" : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="********"
            className="w-full border-b-2 border-slate-200 bg-transparent py-3 pr-10 outline-none focus:border-blue-600"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading
          ? "Signing In..."
          : "Sign In"}
      </button>
    </form>
  );
}