"use client";

import { useState, useEffect } from "react";
import { subDays } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAirQualityData } from "@/hooks/useAirQualityData";
import { DataSelector } from "../data-selector";
import { DustCard } from "./dust-card";
import { GasCard } from "./gas-card";
import { ChartData, ChartType } from "@/lib/types/common";
import { DateRange } from "react-day-picker";
import { GasType } from "@/lib/types/air-quality";
import { DatePickerWithRange } from "../date-range-picker";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle } from "lucide-react";

export function AirQualityDashboard() {
  const [location, setLocation] = useState("all");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { loading, airQualityData, averages, error } = useAirQualityData(
    location,
    dateRange
  );

  const [historicalData, setHistoricalData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (airQualityData && airQualityData.length > 0) {
      const sortedData = [...airQualityData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const formattedData: ChartData[] = sortedData.map((entry) => ({
        name: entry.date,
        pm25: entry.avgPm25,
        pm10: entry.avgPm10,
        no2: entry.avgNo2,
        co: entry.avgCo,
        o2: entry.avgO2,
        so2: entry.avgSo2,
        ch4: entry.avgCh4,
        voc: entry.avgVoc,
      }));

      setHistoricalData(formattedData);
    } else {
      setHistoricalData([]);
    }
  }, [airQualityData]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle>Air Quality Overview</CardTitle>
            <CardDescription>
              Realtime air quality monitoring across mining zones
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <DataSelector location={location} setLocation={setLocation} />
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            <div className="flex gap-2">
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                onClick={() => setChartType("line")}
              >
                Line Chart
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                onClick={() => setChartType("bar")}
              >
                Bar Chart
              </Button>
            </div>
          </div>
        </CardHeader>
        {!dateRange && (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Selezionare un range di date valido
          </div>
        )}
        {error && dateRange && (
          <Alert variant="destructive" className="h-[300px] flex items-center">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Errore</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!error && !historicalData.length && (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Nessun dato disponibile per l'intervallo selezionato
          </div>
        )}
        {!error && historicalData.length && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DustCard
                loading={loading}
                historicalData={historicalData}
                averageDust={(averages.pm25 + averages.pm10) / 2}
                chartType={chartType}
                isSingleDay={dateRange?.from === dateRange?.to}
              />

              {(["co", "no2", "so2", "ch4", "voc", "o2"] as GasType[]).map(
                (gas) => (
                  <GasCard
                    loading={loading}
                    key={gas}
                    gasType={gas}
                    averageGas={averages[gas]}
                    historicalData={historicalData}
                    chartType={chartType}
                    isSingleDay={dateRange?.from === dateRange?.to}
                  />
                )
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
