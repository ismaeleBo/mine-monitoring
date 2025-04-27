export interface ChartData {
  name: string; // es: "27 Apr", "28 Apr", ecc.
  value?: number; // Primo valore generico per grafici base
  value2?: number; // Secondo valore generico
  value3?: number; // Terzo valore generico

  // Specifici parametri ambientali:
  pm25?: number; // Particolato fine (µg/m³)
  pm10?: number; // Particolato grosso (µg/m³)
  no2?: number; // Biossido di azoto (ppb)
  co?: number; // Monossido di carbonio (ppm)
  o2?: number; // Ossigeno (%)
  so2?: number; // Anidride solforosa (ppb)
  ch4?: number; // Metano (ppm)
  voc?: number; // Composti Organici Volatili (ppb o simili)
}

export type ChartType = "line" | "bar";
