"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Alarm } from "@/lib/types/alarms";

interface SocketClientEvents {
  "new-alarm": (alarm: Alarm) => void;
}

const SocketContext = createContext<Socket<SocketClientEvents> | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket<SocketClientEvents> | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!);
    socketRef.current = socket;

    socket.on("connect", () => console.log("[Socket] Connected"));
    socket.on("disconnect", () => console.warn("[Socket] Disconnected"));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  if (typeof window === "undefined") {
    return null;
  }
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
}
