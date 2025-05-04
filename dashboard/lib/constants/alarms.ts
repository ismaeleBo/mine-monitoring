import { AlarmParameter, AlarmSeverity } from "../types/alarms";

export const ALARM_SEVERITY_LABELS: Record<AlarmSeverity, string> = {
  [AlarmSeverity.LOW]: "Low",
  [AlarmSeverity.MEDIUM]: "Medium",
  [AlarmSeverity.HIGH]: "High",
  [AlarmSeverity.CRITICAL]: "Critical",
};

export const ALARM_PARAMETER_LABELS: Record<
  AlarmParameter,
  { label: string; unit: string }
> = {
  [AlarmParameter.PM2_5]: { label: "PM2.5", unit: "μg/m³" },
  [AlarmParameter.PM10]: { label: "PM10", unit: "μg/m³" },
  [AlarmParameter.CO]: { label: "CO", unit: "ppm" },
  [AlarmParameter.NO2]: { label: "NO₂", unit: "ppb" },
  [AlarmParameter.O2]: { label: "O₂", unit: "%" },
  [AlarmParameter.pH]: { label: "pH", unit: "" },
  [AlarmParameter.CONDUCTIVITY]: { label: "Conductivity", unit: "µS/cm" },
  [AlarmParameter.DO]: { label: "Dissolved oxygen", unit: "mg/L" },
  [AlarmParameter.AS]: { label: "Arsenic", unit: "mg/L" },
  [AlarmParameter.PB]: { label: "Plumb", unit: "mg/L" },
  [AlarmParameter.VOC]: { label: "VOC", unit: "ppb" },
  [AlarmParameter.EXTRACTED_MATERIAL]: {
    label: "Extracted material",
    unit: "t/h",
  },
  [AlarmParameter.LOADS_MOVED]: { label: "Loads moved", unit: "units/h" },
  [AlarmParameter.MACHINE_OPERATING_HOURS]: {
    label: "Machine operating hours",
    unit: "h/day",
  },
};
