export const AIR_QUALITY_LOCATION_LABELS: Record<string, string> = {
  "openpit-sector": "Openpit Sector",
  "tunnel-ventilation": "Tunnel Ventilation",
  perimeter: "Perimeter",
  "workshop-area": "Workshop Area",
  "stockpile-area": "Stockpile Area",
  "internal-roads": "Internal Roads",
  "loading-zone": "Loading Zone",
  "underground-pit": "Underground Pit",
  "fuel-storage": "Fuel Storage",
};

export const WATER_QUALITY_LOCATION_LABELS: Record<string, string> = {
  "tailings-pond": "Tailings pond",
  "surface-stream": "Surface stream",
  "groundwater-monitoring": "Groundwater monitoring",
  "drainage-channel": "Drainage channel",
};

export const SOIL_QUALITY_LOCATION_LABELS: Record<string, string> = {
  "stockpile-area": "Stockpile Area",
  "fuel-storage": "Fuel Storage",
  perimeter: "Perimeter",
  "workshop-area": "Workshop Area",
};

export const PRODUCTION_MONITORING_LOCATION_LABELS: Record<string, string> = {
  "stockpile-area": "Stockpile Area",
  "fuel-storage": "Fuel Storage",
  "internal-roads": "Internal Roads",
  "workshop-area": "Workshop Area",
  "loading-zone": "Loading Zone",
  "machine-fleet": "Machine Fleet",
  "openpit-sector": "Openpit Sector",
};

export const LOCATION_LABELS: Record<string, string> = {
  ...AIR_QUALITY_LOCATION_LABELS,
  ...WATER_QUALITY_LOCATION_LABELS,
  ...SOIL_QUALITY_LOCATION_LABELS,
  ...PRODUCTION_MONITORING_LOCATION_LABELS,
};
