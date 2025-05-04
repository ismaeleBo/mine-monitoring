export interface ChartData {
  name: string;
  [parameter: string]: string | number | undefined;
}

export type ChartType = "line" | "bar";
