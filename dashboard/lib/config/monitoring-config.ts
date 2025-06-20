export enum MonitoringConfigKeys {
  AIR = "air",
  WATER = "water",
  SOIL = "soil",
  PRODUCTION = "production",
}

export const monitoringConfig = {
  [MonitoringConfigKeys.AIR]: {
    endpoint: "air-quality",
    parameters: ["pm25", "pm10", "no2", "co", "o2", "so2", "ch4", "voc"],
    averageKeys: {
      pm25: "avgPm25",
      pm10: "avgPm10",
      no2: "avgNo2",
      co: "avgCo",
      o2: "avgO2",
      so2: "avgSo2",
      ch4: "avgCh4",
      voc: "avgVoc",
    },
  },
  [MonitoringConfigKeys.WATER]: {
    endpoint: "water-quality",
    parameters: ["ph", "do", "conductivity", "as"],
    averageKeys: {
      ph: "avgPh",
      do: "avgDo",
      conductivity: "avgConductivity",
      as: "avgAs",
    },
  },
  [MonitoringConfigKeys.SOIL]: {
    endpoint: "soil-quality",
    parameters: ["voc", "pb"],
    averageKeys: {
      voc: "avgVoc",
      pb: "avgPb",
    },
  },
  [MonitoringConfigKeys.PRODUCTION]: {
    endpoint: "production-monitoring",
    parameters: ["extractedMaterial", "loadsMoved", "machineOperatingHours"],
    averageKeys: {
      extractedMaterial: "avgExtractedMaterial",
      loadsMoved: "avgLoadsMoved",
      machineOperatingHours: "avgMachineOperatingHours",
    },
  },
} as const;

export type MonitoringType = keyof typeof monitoringConfig;
