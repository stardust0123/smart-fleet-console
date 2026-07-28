"use client";

import { ChevronDown, Copy, Check } from "lucide-react";
import { useState } from "react";

const demoAccounts = [
  {
    role: "Owner",
    email: "owner@smartfleet.com",
  },
  {
    role: "Manager",
    email: "manager@smartfleet.com",
  },
  {
    role: "Mechanic",
    email: "mechanic@smartfleet.com",
  },
  {
    role: "Safety",
    email: "safety@smartfleet.com",
  },
  {
    role: "Driver",
    email: "driver@smartfleet.com",
  },
];

export default function DemoAccordion() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState("");

  async function copyEmail(email: string) {
    await navigator.clipboard.writeText(email);

    setCopied(email);

    setTimeout(() => {
      setCopied("");
    }, 1500);
  }

  return (
    <div className="mt-12">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between

          rounded-xl

          border
          border-slate-200

          px-5
          py-4

          transition

          hover:bg-slate-50
        "
      >
        <span className="font-semibold text-slate-800">
          Demo Accounts
        </span>

        <ChevronDown
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
          size={18}
        />
      </button>

      {open && (
        <div className="mt-4 space-y-3">

          {demoAccounts.map((account) => (
            <div
              key={account.email}
              className="
                flex
                items-center
                justify-between

                rounded-xl

                border
                border-slate-200

                p-4

                transition

                hover:border-blue-300
                hover:bg-blue-50/40
              "
            >
              <div>

                <span
                  className="
                    rounded-full

                    bg-blue-100

                    px-2.5
                    py-1

                    text-xs
                    font-semibold

                    text-blue-700
                  "
                >
                  {account.role}
                </span>

                <p className="mt-2 text-sm text-slate-500">
                  {account.email}
                </p>

              </div>

              <button
                type="button"
                onClick={() => copyEmail(account.email)}
                className="
                  rounded-lg

                  p-2

                  transition

                  hover:bg-white
                "
              >
                {copied === account.email ? (
                  <Check
                    size={18}
                    className="text-green-600"
                  />
                ) : (
                  <Copy
                    size={18}
                    className="text-slate-500"
                  />
                )}
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}