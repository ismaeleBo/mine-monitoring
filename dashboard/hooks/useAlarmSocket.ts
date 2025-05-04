"use client";

import { ALARM_PARAMETER_LABELS } from "@/lib/constants/alarms";
import { LOCATION_LABELS } from "@/lib/constants/locations";
import { Alarm, AlarmSeverity } from "@/lib/types/alarms";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export function useAlarmNotifications() {
  const router = useRouter();

  useEffect(() => {
    const socket: Socket = io("http://localhost:3010");

    socket.on("connect", () => {
      console.log("[WS] Connesso al WebSocket");
    });

    socket.on("new-alarm", (alarm: Alarm) => {
      console.log("NEW ALARM!", alarm);
      showAlarmToast(alarm, router);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}

function showAlarmToast(alarm: Alarm, router: AppRouterInstance) {
  const message = `🔥 ${ALARM_PARAMETER_LABELS[alarm.parameter].label} = ${
    alarm.measuredValue
  } ${ALARM_PARAMETER_LABELS[alarm.parameter].unit} (Threshold: ${
    alarm.thresholdExceeded
  })`;
  const description = `[${alarm.severity}] Zona: ${
    LOCATION_LABELS[alarm.location] || alarm.location
  } | Sensore: ${alarm.sensorId}`;
  const action = { label: "Show All", onClick: () => router.push("/alarms") };

  switch (alarm.severity) {
    case AlarmSeverity.CRITICAL:
    case AlarmSeverity.HIGH:
      toast.error(message, { description, action });
      break;
    case AlarmSeverity.MEDIUM:
      toast.warning(message, { description, action });
      break;
    default:
      toast(message, { description, action });
  }
}
