import { AlarmParameter, AlarmSeverity } from "../types/alarms";

export const ALARM_SEVERITY_LABELS: Record<
  AlarmSeverity,
  { label: string; color: string }
> = {
  [AlarmSeverity.LOW]: { label: "Low", color: "#fff" },
  [AlarmSeverity.MEDIUM]: { label: "Medium", color: "#FFD32C" },
  [AlarmSeverity.HIGH]: { label: "High", color: "#ff8383" },
  [AlarmSeverity.CRITICAL]: { label: "Critical", color: "#c675e2" },
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
  [AlarmParameter.pH]: { label: "pH", unit: " " },
  [AlarmParameter.CONDUCTIVITY]: { label: "Conductivity", unit: "µS/cm" },
  [AlarmParameter.DO]: { label: "Dissolved oxygen", unit: "mg/L" },
  [AlarmParameter.As]: { label: "Arsenic", unit: "mg/L" },
  [AlarmParameter.Pb]: { label: "Plumb", unit: "mg/L" },
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
  [AlarmParameter.CH4]: {
    label: "CH4",
    unit: "%",
  },
  [AlarmParameter.SO2]: {
    label: "SO₂",
    unit: "ppb",
  },
};
