"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ChartData } from "@/lib/types/common";
import {
  monitoringConfig,
  MonitoringType,
} from "@/lib/config/monitoring-config";
import { formatDynamicDecimals } from "@/lib/utils";

export function useMonitoringData(
  type: MonitoringType,
  location: string,
  dateRange?: DateRange
) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<any[]>([]);
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);

  const config = monitoringConfig[type];

  const isSingleDay =
    dateRange?.from &&
    dateRange?.to &&
    dateRange.from.toDateString() === dateRange.to.toDateString();

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = isSingleDay
        ? `${process.env.NEXT_PUBLIC_API_URL}/${config.endpoint}/stats/daily-measurements`
        : `${process.env.NEXT_PUBLIC_API_URL}/${config.endpoint}/stats/daily-average`;

      const params = new URLSearchParams();

      if (dateRange?.from) {
        const from = format(dateRange.from, "yyyy-MM-dd");
        isSingleDay
          ? params.append("date", from)
          : params.append("startDate", from);
      }
      if (dateRange?.to && !isSingleDay) {
        params.append("endDate", format(dateRange.to, "yyyy-MM-dd"));
      }
      if (location && location !== "all") {
        params.append("location", location);
      }

      url += `?${params.toString()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Fetch error");

      const data = await res.json();
      setRawData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Impossibile caricare i dati.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, dateRange]);

  useEffect(() => {
    if (rawData.length === 0) return setHistoricalData([]);

    const parsed: ChartData[] = rawData.map((entry) => {
      const name = isSingleDay ? entry.timestamp : entry.date;
      const data: ChartData = { name };

      for (const key of config.parameters) {
        const avgKey = isSingleDay
          ? key
          : config.averageKeys[key as keyof typeof config.averageKeys];
        const value = entry[avgKey];
        if (value !== undefined && value !== null) {
          data[key] = value;
        }
      }

      return data;
    });

    setHistoricalData(parsed);
  }, [rawData, isSingleDay]);

  const averages = Object.fromEntries(
    config.parameters.map((key) => [
      key,
      averageValue(
        historicalData.map((d) => {
          const val = d[key];
          return typeof val === "number" ? val : undefined;
        })
      ),
    ])
  );

  return { loading, error, historicalData, averages, isSingleDay };
}

function averageValue(values: (number | undefined)[]) {
  const filtered = values.filter((v): v is number => typeof v === "number");
  if (filtered.length === 0) return 0;
  return parseFloat(
    formatDynamicDecimals(filtered.reduce((a, b) => a + b, 0) / filtered.length)
  );
}
