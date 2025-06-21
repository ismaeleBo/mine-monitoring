"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Alarm } from "@/lib/types/alarms";

interface SocketClientEvents {
  "new-alarm": (alarm: Alarm) => void;
}

const SocketContext = createContext<Socket<SocketClientEvents> | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket<SocketClientEvents> | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!);
    setSocket(socketInstance);
    socketInstance.on("connect", () => console.log("[Socket] Connected"));
    socketInstance.on("disconnect", () =>
      console.warn("[Socket] Disconnected")
    );

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  if (typeof window === "undefined") {
    return null;
  }
  return useContext(SocketContext);
}
