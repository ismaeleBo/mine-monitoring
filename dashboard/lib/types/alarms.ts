export interface Alarm {
  id: number;
  sensorId: string;
  timestamp: string;
  location: string;
  parameter: AlarmParameter;
  measuredValue: number;
  thresholdExceeded: number;
  severity: AlarmSeverity;
}

export enum AlarmSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum AlarmParameter {
  PM2_5 = "PM2_5",
  PM10 = "PM10",
  CO = "CO",
  NO2 = "NO2",
  O2 = "O2",
  VOC = "VOC",
  pH = "pH",
  CONDUCTIVITY = "Conductivity",
  DO = "DO",
  AS = "As",
  PB = "Pb",
  EXTRACTED_MATERIAL = "EXTRACTED_MATERIAL",
  LOADS_MOVED = "LOADS_MOVED",
  MACHINE_OPERATING_HOURS = "MACHINE_OPERATING_HOURS",
}
