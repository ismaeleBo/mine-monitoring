import { ChartData } from "./types/common";
import { DailyAverageDto } from "@/lib/types/air-quality";

export function downloadAirQualityData(data: DailyAverageDto[]) {
  if (!data.length) return;

  const csvHeader = [
    "Date",
    "avgPm25",
    "avgPm10",
    "avgNo2",
    "avgCo",
    "avgO2",
    "avgSo2",
    "avgCh4",
    "avgVoc",
  ].join(",");

  const csvRows = data.map((item) =>
    [
      item.date,
      item.avgPm25 ?? "",
      item.avgPm10 ?? "",
      item.avgNo2 ?? "",
      item.avgCo ?? "",
      item.avgO2 ?? "",
      item.avgSo2 ?? "",
      item.avgCh4 ?? "",
      item.avgVoc ?? "",
    ].join(",")
  );

  const csvContent = [csvHeader, ...csvRows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `air-quality-data-${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatDustData(data: ChartData[]): ChartData[] {
  return data.map((item) => ({
    name: item.name,
    value: ((Number(item.pm25) ?? 0) + (Number(item.pm10) ?? 0)) / 2,
  }));
}

export function formatParameterData(
  data: ChartData[],
  parameter: keyof ChartData
): ChartData[] {
  return data.map((item) => ({
    name: item.name,
    value: (item[parameter] as number) ?? 0,
  }));
}
