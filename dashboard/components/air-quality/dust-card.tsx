"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SimpleBarChart, SimpleLineChart } from "@/components/dashboard-charts";
import { ChartData, ChartType } from "@/lib/types/common";

interface DustCardProps {
  loading: boolean;
  historicalData: ChartData[];
  averageDust: number;
  chartType: ChartType;
  isSingleDay: boolean;
}

export function DustCard({
  loading,
  historicalData,
  averageDust,
  chartType,
  isSingleDay,
}: DustCardProps) {
  if (!isSingleDay && !averageDust) {
    return;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fine Dust</CardTitle>
        <CardDescription>PM2.5 & PM10 average (μg/m³)</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold">
              {averageDust.toFixed(1)} μg/m³
            </div>
            <div className="mt-4 h-[200px]">
              {chartType === "line" ? (
                <SimpleLineChart
                  title="Fine Dust Concentration"
                  data={historicalData.map((item) => ({
                    name: item.name,
                    value: ((item.pm25 ?? 0) + (item.pm10 ?? 0)) / 2,
                  }))}
                  dataKeys={["value"]}
                  unit="μg/m³"
                  isSingleDay={isSingleDay}
                />
              ) : (
                <SimpleBarChart
                  title="Fine Dust Concentration"
                  data={historicalData.map((item) => ({
                    name: item.name,
                    value: ((item.pm25 ?? 0) + (item.pm10 ?? 0)) / 2,
                  }))}
                  dataKeys={["value"]}
                  unit="μg/m³"
                  isSingleDay={isSingleDay}
                />
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
