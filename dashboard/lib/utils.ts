import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDynamicDecimals(value: number): string {
  if (value >= 1) return value.toFixed(2);
  if (value >= 0.1) return value.toFixed(3);
  if (value >= 0.01) return value.toFixed(4);
  return value.toFixed(5);
}
