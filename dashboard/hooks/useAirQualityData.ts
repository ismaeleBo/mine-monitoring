"use client";

import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DailyAverageDto } from "@/lib/types/air-quality";
import { ChartData } from "@/lib/types/common";

export function useAirQualityData(location: string, dateRange?: DateRange) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [airQualityData, setAirQualityData] = useState<DailyAverageDto[]>([]);
  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);

  const fetchAirQualityData = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:3001/air-quality/stats/daily-average";

      const params = new URLSearchParams();

      if (dateRange?.from) {
        params.append("startDate", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
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
    }, 5 * 60 * 1000); // ogni 5 minuti

    return () => clearInterval(interval);
  }, [location, dateRange]);

  useEffect(() => {
    if (airQualityData.length > 0) {
      const formatted: ChartData[] = airQualityData.map((entry) => ({
        name: entry.date,
        pm25: entry.avgPm25 ?? 0,
        pm10: entry.avgPm10 ?? 0,
        no2: entry.avgNo2 ?? 0,
        co: entry.avgCo ?? 0,
        o2: entry.avgO2 ?? 0,
        so2: entry.avgSo2 ?? 0,
        ch4: entry.avgCh4 ?? 0,
        voc: entry.avgVoc ?? 0,
      }));

      setHistoricalData(formatted);
    } else {
      setHistoricalData([]);
    }
  }, [airQualityData]);

  const averages = {
    pm25: averageValue(airQualityData.map((d) => d.avgPm25)),
    pm10: averageValue(airQualityData.map((d) => d.avgPm10)),
    no2: averageValue(airQualityData.map((d) => d.avgNo2)),
    co: averageValue(airQualityData.map((d) => d.avgCo)),
    o2: averageValue(airQualityData.map((d) => d.avgO2)),
    so2: averageValue(airQualityData.map((d) => d.avgSo2)),
    ch4: averageValue(airQualityData.map((d) => d.avgCh4)),
    voc: averageValue(airQualityData.map((d) => d.avgVoc)),
  };

  return {
    loading,
    error,
    airQualityData,
    historicalData,
    averages,
  };
}

// Utility per media
function averageValue(values: (number | undefined)[]): number {
  const filtered = values.filter((v) => v !== undefined) as number[];
  if (filtered.length === 0) return 0;
  const sum = filtered.reduce((acc, val) => acc + val, 0);
  return parseFloat((sum / filtered.length).toFixed(1));
}
