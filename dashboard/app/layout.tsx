"use client";

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { DashboardHeader } from "@/components/dashboard-header";
import { SocketProvider } from "@/lib/contexts/socket-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SocketProvider>
      <html lang="en">
        <body>
          <div className="flex min-h-screen w-full flex-col">
            <DashboardHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" richColors closeButton />
        </body>
      </html>
    </SocketProvider>
  );
}
