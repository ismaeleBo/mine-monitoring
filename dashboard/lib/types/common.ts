export interface ChartData {
  name: string;
  value?: number;
  value2?: number;
  value3?: number;

  pm25?: number;
  pm10?: number;
  no2?: number;
  co?: number;
  o2?: number;
  so2?: number;
  ch4?: number;
  voc?: number;
}

export type ChartType = "line" | "bar";
