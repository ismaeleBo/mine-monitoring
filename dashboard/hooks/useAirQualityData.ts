"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  DailyAverageDto,
  DailyMeasurementsResponse,
} from "@/lib/types/air-quality";
import { ChartData } from "@/lib/types/common";

export function useAirQualityData(location: string, dateRange?: DateRange) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [airQualityData, setAirQualityData] = useState<
    (DailyAverageDto | DailyMeasurementsResponse)[]
  >([]);
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);

  const isSingleDay =
    dateRange?.from &&
    dateRange?.to &&
    dateRange.from.toDateString() === dateRange.to.toDateString();

  const fetchAirQualityData = async () => {
    setLoading(true);
    try {
      let url = isSingleDay
        ? "http://localhost:3010/air-quality/stats/daily-measurements"
        : "http://localhost:3010/air-quality/stats/daily-average";

      const params = new URLSearchParams();

      if (dateRange?.from) {
        if (isSingleDay) {
          params.append("date", format(dateRange.from, "yyyy-MM-dd"));
        } else {
          params.append("startDate", format(dateRange.from, "yyyy-MM-dd"));
        }
      }
      if (dateRange?.to && !isSingleDay) {
        params.append("endDate", format(dateRange.to, "yyyy-MM-dd"));
      }
      if (location && location !== "all") {
        params.append("location", location);
      }

      url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati");
      }

      const data = await response.json();
      setAirQualityData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Errore nel fetch:", err);
      setError("Impossibile caricare i dati.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQualityData();

    const interval = setInterval(() => {
      fetchAirQualityData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [location, dateRange]);

  useEffect(() => {
    if (airQualityData.length > 0) {
      if (isSingleDay) {
        const formatted: ChartData[] = airQualityData.map((entry) => {
          const point: ChartData = {
            name: "timestamp" in entry ? entry.timestamp : "",
          };

          if (
            "pm25" in entry &&
            entry.pm25 !== null &&
            entry.pm25 !== undefined
          )
            point.pm25 = entry.pm25;
          if (
            "pm10" in entry &&
            entry.pm10 !== null &&
            entry.pm10 !== undefined
          )
            point.pm10 = entry.pm10;
          if ("no2" in entry && entry.no2 !== null && entry.no2 !== undefined)
            point.no2 = entry.no2;
          if ("co" in entry && entry.co !== null && entry.co !== undefined)
            point.co = entry.co;
          if ("o2" in entry && entry.o2 !== null && entry.o2 !== undefined)
            point.o2 = entry.o2;
          if ("so2" in entry && entry.so2 !== null && entry.so2 !== undefined)
            point.so2 = entry.so2;
          if ("ch4" in entry && entry.ch4 !== null && entry.ch4 !== undefined)
            point.ch4 = entry.ch4;
          if ("voc" in entry && entry.voc !== null && entry.voc !== undefined)
            point.voc = entry.voc;

          return point;
        });

        setHistoricalData(formatted);
      } else {
        // Mapping per range
        const formatted: ChartData[] = airQualityData.map((entry) => ({
          name: "date" in entry ? entry.date : "",
          pm25: "avgPm25" in entry ? entry.avgPm25 ?? 0 : 0,
          pm10: "avgPm10" in entry ? entry.avgPm10 ?? 0 : 0,
          no2: "avgNo2" in entry ? entry.avgNo2 ?? 0 : 0,
          co: "avgCo" in entry ? entry.avgCo ?? 0 : 0,
          o2: "avgO2" in entry ? entry.avgO2 ?? 0 : 0,
          so2: "avgSo2" in entry ? entry.avgSo2 ?? 0 : 0,
          ch4: "avgCh4" in entry ? entry.avgCh4 ?? 0 : 0,
          voc: "avgVoc" in entry ? entry.avgVoc ?? 0 : 0,
        }));

        setHistoricalData(formatted);
      }
    } else {
      setHistoricalData([]);
    }
  }, [airQualityData, isSingleDay]);

  const averages = {
    pm25: averageValue(historicalData.map((d) => d.pm25)),
    pm10: averageValue(historicalData.map((d) => d.pm10)),
    no2: averageValue(historicalData.map((d) => d.no2)),
    co: averageValue(historicalData.map((d) => d.co)),
    o2: averageValue(historicalData.map((d) => d.o2)),
    so2: averageValue(historicalData.map((d) => d.so2)),
    ch4: averageValue(historicalData.map((d) => d.ch4)),
    voc: averageValue(historicalData.map((d) => d.voc)),
  };

  return {
    loading,
    error,
    airQualityData,
    historicalData,
    averages,
    isSingleDay,
  };
}

function averageValue(values: (number | undefined)[]): number {
  const filtered = values.filter((v) => v !== undefined) as number[];
  if (filtered.length === 0) return 0;
  const sum = filtered.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / filtered.length).toFixed(1));
}
