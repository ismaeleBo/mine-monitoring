"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ChartType, ChartData } from "@/lib/types/common";
import { SimpleLineChart, SimpleBarChart } from "@/components/dashboard-charts";
import { formatDynamicDecimals } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  unit: string;
  parameterKey: string;
  averageValue: number;
  historicalData: ChartData[];
  chartType: ChartType;
  isSingleDay: boolean;
  loading: boolean;
}

export function MetricCard({
  title,
  unit,
  parameterKey,
  averageValue,
  historicalData,
  chartType,
  isSingleDay,
  loading,
}: MetricCardProps) {
  const data = historicalData
    .filter((d) => typeof d[parameterKey] === "number")
    .map((d) => ({
      name: d.name,
      value: d[parameterKey] as number,
    }));

  if (!isSingleDay && !averageValue) return null;
  if (isSingleDay && data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Average {unit && `(${unit})`}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold">
              {formatDynamicDecimals(averageValue)} {unit}
            </div>
            <div className="mt-4 h-[200px]">
              {chartType === "line" ? (
                <SimpleLineChart
                  data={data}
                  dataKeys={["value"]}
                  unit={unit}
                  isSingleDay={isSingleDay}
                />
              ) : (
                <SimpleBarChart
                  data={data}
                  dataKeys={["value"]}
                  unit={unit}
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
