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

interface LocationSelectorProps {
  location: string;
  locationList: Record<string, string>;
  setLocation: (value: string) => void;
  airQualityData?: DailyAverageDto[];
}

export function LocationSelector({
  location,
  setLocation,
  locationList,
  airQualityData = [],
}: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {Object.entries(locationList).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
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
