"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd LLL, yyyy")} –{" "}
                  {format(date.to, "dd LLL, yyyy")}
                </>
              ) : (
                format(date.from, "dd LLL, yyyy")
              )
            ) : (
              <span>Seleziona intervallo</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(day) => day > new Date()}
            modifiers={{
              disabled: (day) => day > new Date(),
            }}
            modifiersClassNames={{
              selected: "bg-gray-500/60 text-white",
              range_start: "rounded-l-full bg-gray-500/60 text-white",
              range_end: "rounded-r-full bg-gray-500/60 text-white",
              in_range: "bg-primary/20 text-primary-foreground",
              disabled: "opacity-40 pointer-events-none",
            }}
            classNames={{
              cell: "relative p-1",
              day_selected: "bg-gray-500 text-white hover:bg-primary",
              day_range_start: "bg-gray-500 text-white rounded-l-full",
              day_range_end: "bg-gray-500 text-white rounded-r-full",
              day_range_middle: "bg-primary/20",
              day_disabled: "opacity-40 pointer-events-none",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
