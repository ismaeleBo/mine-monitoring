export interface AirQualityReadings {
  pm25: {
    value: number;
    unit: string;
    status: string;
  };
  pm10: {
    value: number;
    unit: string;
    status: string;
  };
  no2: {
    value: number;
    unit: string;
    status: string;
  };
  co: {
    value: number;
    unit: string;
    status: string;
  };
  o2: {
    value: number;
    unit: string;
    status: string;
  };
  so2: {
    value: number;
    unit: string;
    status: string;
  };
  ch4: {
    value: number;
    unit: string;
    status: string;
  };
  voc: {
    value: number;
    unit: string;
    status: string;
  };
}

export interface AirQualityResponse {
  id: number;
  sensorId: string;
  location: string;
  timestamp: string;
  readings: AirQualityReadings;
}

export interface AirQualityAveragesState {
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  o2: number;
  so2: number;
  ch4: number;
  voc: number;
}

export interface DailyAverageDto {
  date: string;
  avgPm25: number;
  avgPm10: number;
  avgNo2: number;
  avgCo: number;
  avgO2: number;
  avgSo2: number;
  avgCh4: number;
  avgVoc: number;
}

export interface DailyMeasurementsResponse {
  timestamp: string;

  pm25?: number;
  pm10?: number;
  no2?: number;
  co?: number;
  o2?: number;
  so2?: number;
  ch4?: number;
  voc?: number;
}

export type GasType = "co" | "no2" | "so2" | "ch4" | "voc" | "o2";
