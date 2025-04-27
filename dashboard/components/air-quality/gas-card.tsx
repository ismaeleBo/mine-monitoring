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
import { GasType } from "@/lib/types/air-quality";

interface GasCardProps {
  loading: boolean;
  historicalData: ChartData[];
  averageGas: number;
  gasType: GasType;
  chartType: ChartType;
  isSingleDay: boolean;
}

const gasLabels: Record<GasType, { title: string; unit: string }> = {
  co: { title: "CO Levels", unit: "ppm" },
  no2: { title: "NO₂ Levels", unit: "ppb" },
  so2: { title: "SO₂ Levels", unit: "ppb" },
  ch4: { title: "CH₄ (Methane) Levels", unit: "%" },
  voc: { title: "VOC Concentration", unit: "ppb" },
  o2: { title: "O₂ Concentration", unit: "%" },
};

export function GasCard({
  loading,
  historicalData,
  averageGas,
  gasType,
  chartType,
  isSingleDay,
}: GasCardProps) {
  const label = gasLabels[gasType];

  if (!isSingleDay && !averageGas) {
    return;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label.title}</CardTitle>
        <CardDescription>Average ({label.unit})</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold">
              {averageGas.toFixed(2)} {label.unit}
            </div>
            <div className="mt-4 h-[200px]">
              {chartType === "line" ? (
                <SimpleLineChart
                  title={`${label.title} Trend`}
                  data={historicalData.map((item) => ({
                    name: item.name,
                    value: item[gasType] ?? 0,
                  }))}
                  dataKeys={["value"]}
                  unit={`${label.unit}`}
                  isSingleDay={isSingleDay}
                />
              ) : (
                <SimpleBarChart
                  title={`${label.title} Trend`}
                  data={historicalData.map((item) => ({
                    name: item.name,
                    value: item[gasType] ?? 0,
                  }))}
                  dataKeys={["value"]}
                  unit={`${label.unit}`}
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
