"use client";

import { useState } from "react";
import { subDays, format } from "date-fns";
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
import { DateRange } from "react-day-picker";
import { GasType } from "@/lib/types/air-quality";
import { DatePickerWithRange } from "../date-range-picker";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { ChartType } from "@/lib/types/common";

export function AirQualityDashboard() {
  const [location, setLocation] = useState("all");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { loading, error, historicalData, averages } = useAirQualityData(
    location,
    dateRange
  );

  const isSingleDay =
    dateRange?.from && dateRange?.to
      ? format(dateRange.from, "yyyy-MM-dd") ===
        format(dateRange.to, "yyyy-MM-dd")
      : false;

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
          <div className="flex flex-wrap items-center gap-2">
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

        {loading && (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!dateRange && (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Selezionare un intervallo di tempo per visualizzare i dati
          </div>
        )}

        {dateRange && error && (
          <Alert variant="destructive" className="h-[300px] flex items-center">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Errore</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error &&
          !loading &&
          (!historicalData.length ||
            historicalData.every(
              (d) =>
                Object.values(d).filter((v) => typeof v === "number").length ===
                0
            )) && (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Nessun dato disponibile per l'intervallo selezionato
            </div>
          )}

        {!error && historicalData.length > 0 && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DustCard
                loading={loading}
                historicalData={historicalData}
                averageDust={(averages.pm25 + averages.pm10) / 2}
                chartType={chartType}
                isSingleDay={isSingleDay}
              />

              {(["co", "no2", "so2", "ch4", "voc", "o2"] as GasType[]).map(
                (gas) => (
                  <GasCard
                    key={gas}
                    loading={loading}
                    gasType={gas}
                    averageGas={averages[gas]}
                    historicalData={historicalData}
                    chartType={chartType}
                    isSingleDay={isSingleDay}
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
