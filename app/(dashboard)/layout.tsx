import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/layout/Sidebar"; // Import thanh menu Sidebar của bạn

export const metadata: Metadata = {
  title: "Smart Fleet Management Console",
  description: "Fleet Management System Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}