import { io, Socket } from "socket.io-client";
import { Alarm } from "@/lib/types/alarms";

let socket: Socket<Alarm> | null = null;

export interface SocketClientEvents {
  "new-alarm": (alarm: Alarm) => void;
}

export function getSocket(): Socket<SocketClientEvents> {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL);
    socket.on("connect", () => {
      console.log("[Socket] Connected");
    });
    socket.on("disconnect", () => {
      console.warn("[Socket] Disconnected");
    });
  }
  return socket;
}
