import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Fleet Management Console",
  description: "Fleet Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}