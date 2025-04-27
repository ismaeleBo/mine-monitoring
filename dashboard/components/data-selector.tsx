"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DailyAverageDto } from "@/lib/types/air-quality";
import { downloadAirQualityData } from "@/lib/data-formatters";

interface DataSelectorProps {
  location: string;
  setLocation: (value: string) => void;
  airQualityData?: DailyAverageDto[];
}

export function DataSelector({
  location,
  setLocation,
  airQualityData = [],
}: DataSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          <SelectItem value="openpit-sector">Openpit Sector</SelectItem>
          <SelectItem value="tunnel-ventilation">Tunnel Ventilation</SelectItem>
          <SelectItem value="perimeter">Perimeter</SelectItem>
          <SelectItem value="workshop-area">Workshop Area</SelectItem>
          <SelectItem value="stockpile-area">Stockpile Area</SelectItem>
          <SelectItem value="internal-roads">Internal Roads</SelectItem>
          <SelectItem value="loading-zone">Loading Zone</SelectItem>
          <SelectItem value="underground-pit">Underground Pit</SelectItem>
          <SelectItem value="fuel-storage">Fuel Storage</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={() => downloadAirQualityData(airQualityData)}
      >
        <Download className="h-4 w-4" />
        <span className="sr-only">Download data</span>
      </Button>
    </div>
  );
}
