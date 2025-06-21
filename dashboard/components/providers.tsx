"use client";

import { SocketProvider } from "@/lib/contexts/socket-context";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </SocketProvider>
  );
}
