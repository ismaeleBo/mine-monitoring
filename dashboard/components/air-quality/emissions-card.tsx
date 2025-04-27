import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { SimpleLineChart } from "@/components/dashboard-charts";
import { AirQualityResponse } from "@/lib/types/air-quality";
import { ChartData } from "@/lib/types/common";

interface EmissionsCardProps {
  loading: boolean;
  airQualityData: AirQualityResponse[];
  historicalData: ChartData[];
  averageCO2: number;
}

export function EmissionsCard({
  loading,
  airQualityData,
  historicalData,
  averageCO2,
}: EmissionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CO₂ Emissions</CardTitle>
        <CardDescription>
          Current average (
          {airQualityData.length > 0
            ? airQualityData[0].readings.co2.unit
            : "ppm"}
          )
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold">{averageCO2}</div>
            {airQualityData.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Air Quality Index: {airQualityData[0].airQualityIndex.value} -{" "}
                {airQualityData[0].airQualityIndex.category}
              </p>
            )}
            <div className="mt-4 h-[200px]">
              <SimpleLineChart
                title="CO₂ Emissions Trend"
                data={historicalData}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
