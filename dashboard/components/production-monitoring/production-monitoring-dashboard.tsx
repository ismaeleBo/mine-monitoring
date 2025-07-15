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
import { LocationSelector } from "../data-selector";
import { DatePickerWithRange } from "../date-range-picker";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { ChartType } from "@/lib/types/common";
import { useMonitoringData } from "@/hooks/useMonitoringData";
import { MonitoringConfigKeys } from "@/lib/config/monitoring-config";
import { MetricCard } from "../metric-card";
import { PRODUCTION_MONITORING_LOCATION_LABELS } from "@/lib/constants/locations";
import { productionParameters } from "@/lib/constants/monitoring";

export function ProductionMonitoringDashboard() {
  const [location, setLocation] = useState("all");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { historicalData, averages, loading, error } = useMonitoringData(
    MonitoringConfigKeys.PRODUCTION,
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
            <CardTitle>Production Monitoring Overview</CardTitle>
            <CardDescription>
              Realtime production monitoring across mining zones
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LocationSelector
              locationList={PRODUCTION_MONITORING_LOCATION_LABELS}
              location={location}
              setLocation={setLocation}
            />
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
            Select a time interval to view data
          </div>
        )}

        {dateRange && error && !loading && (
          <Alert variant="destructive" className="h-[300px] flex items-center">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && !loading && !historicalData.length && (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data available with selected filters
          </div>
        )}

        {!error && historicalData.length > 0 && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productionParameters.map(({ key, title, unit }) => (
                <MetricCard
                  key={key}
                  parameterKey={key}
                  title={title}
                  unit={unit}
                  averageValue={averages[key] || 0}
                  historicalData={historicalData}
                  chartType={chartType}
                  isSingleDay={isSingleDay}
                  loading={loading}
                />
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
