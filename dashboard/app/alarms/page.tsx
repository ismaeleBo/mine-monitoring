"use client";

import { useEffect, useState } from "react";
import { LOCATION_LABELS } from "@/lib/constants/locations";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alarm } from "@/lib/types/alarms";
import {
  ALARM_PARAMETER_LABELS,
  ALARM_SEVERITY_LABELS,
} from "@/lib/constants/alarms";
import { getSocket } from "@/lib/socket";

const LIMIT = 10;

export default function AlarmsPage() {
  const [loading, setLoading] = useState(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [location, setLocation] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [parameter, setParameter] = useState("all");
  const [sensorId, setSensorId] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const socket = getSocket();

  useEffect(() => {
    const fetchAlarms = async () => {
      setLoading(true);
      const params = new URLSearchParams();

      if (location !== "all") params.append("location", location);
      if (severity !== "all") params.append("severity", severity);
      if (parameter !== "all") params.append("parameter", parameter);
      if (sensorId) params.append("sensorId", sensorId);
      if (dateRange?.from)
        params.append("startDate", dateRange.from.toISOString());
      if (dateRange?.to) {
        const end = new Date(dateRange.to);
        end.setHours(23, 59, 59, 999);
        params.append("endDate", end.toISOString());
      }
      params.append("page", page.toString());
      params.append("limit", LIMIT.toString());

      const res = await fetch(
        `http://localhost:3010/alarms?${params.toString()}`
      );
      const json = await res.json();
      setAlarms(json.data);
      setTotal(json.total);
      setLoading(false);
    };

    fetchAlarms();

    socket.on("new-alarm", (alarm: Alarm) => {
      fetchAlarms();
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, location, severity, sensorId, dateRange, page, parameter]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Envinonmental Alarms
      </h1>

      <div className="grid md:grid-cols-4 gap-4">
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All zones</SelectItem>
            {Object.entries(LOCATION_LABELS).map(([val, label]) => (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={severity} onValueChange={setSeverity}>
          <SelectTrigger>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.entries(ALARM_SEVERITY_LABELS).map(([val, { label }]) => (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={parameter} onValueChange={setParameter}>
          <SelectTrigger>
            <SelectValue placeholder="Parameter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.entries(ALARM_PARAMETER_LABELS).map(([val, { label }]) => (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Sensor ID"
          value={sensorId}
          onChange={(e) => setSensorId(e.target.value)}
        />

        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      {!alarms.length ? (
        <div className="flex h-[300px] items-center justify-center text-muted-foreground">
          No alarms available for selected filters
        </div>
      ) : (
        <div>
          <div className="grid gap-4">
            {loading && (
              <div className="flex h-[200px] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}
            {alarms.map((alarm) => (
              <Card
                key={alarm.id}
                style={{
                  backgroundColor: ALARM_SEVERITY_LABELS[alarm.severity].color,
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle />
                    {ALARM_PARAMETER_LABELS[alarm.parameter].label} ={" "}
                    {alarm.measuredValue}{" "}
                    {ALARM_PARAMETER_LABELS[alarm.parameter].unit} (
                    {ALARM_SEVERITY_LABELS[alarm.severity].label})
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  Zone: {LOCATION_LABELS[alarm.location] || alarm.location} •
                  Sensor: {alarm.sensorId} •{" "}
                  {format(new Date(alarm.timestamp), "PPPpp")}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              ← Back
            </Button>

            <span>
              Page {page} of {totalPages}
            </span>

            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
