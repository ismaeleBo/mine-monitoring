"use client";

import { ALARM_PARAMETER_LABELS } from "@/lib/constants/alarms";
import { LOCATION_LABELS } from "@/lib/constants/locations";
import { useSocket } from "@/lib/contexts/socket-context";
import { Alarm, AlarmSeverity } from "@/lib/types/alarms";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function useAlarmNotifications() {
  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNewAlarm = (alarm: Alarm) => {
      showAlarmToast(alarm, router);
    };

    socket.on("new-alarm", handleNewAlarm);

    return () => {
      socket.off("new-alarm", handleNewAlarm);
    };
  }, [socket]);
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
