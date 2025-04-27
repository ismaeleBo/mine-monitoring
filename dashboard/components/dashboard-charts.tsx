"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ChartData } from "@/lib/types/common";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function SimpleLineChart({
  data,
  dataKeys = ["value"],
  unit = "",
  isSingleDay,
}: {
  title?: string;
  data?: ChartData[];
  dataKeys?: string[];
  unit?: string;
  isSingleDay: boolean;
}) {
  return (
    <ChartContainer
      config={{
        [dataKeys[0]]: { label: "Primary", color: "hsl(var(--chart-1))" },
        [dataKeys[1]]: { label: "Secondary", color: "hsl(var(--chart-2))" },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              isSingleDay
                ? format(new Date(value), "HH:mm")
                : format(new Date(value), "dd MMM")
            }
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(2)}
            domain={["auto", "auto"]}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => {
              return [`${value.toFixed(2)} ${unit}`];
            }}
            labelFormatter={(label) =>
              format(new Date(label), "dd/MM/yy HH:mm")
            }
          />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`hsl(var(--chart-${index + 1}))`}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function SimpleBarChart({
  data,
  dataKeys = ["value"],
  unit = "",
  isSingleDay,
}: {
  title?: string;
  data?: ChartData[];
  dataKeys?: string[];
  unit?: string;
  isSingleDay: boolean;
}) {
  return (
    <ChartContainer
      config={{
        [dataKeys[0]]: { label: "Primary", color: "hsl(var(--chart-1))" },
        [dataKeys[1]]: { label: "Secondary", color: "hsl(var(--chart-2))" },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              isSingleDay
                ? format(new Date(value), "HH:mm")
                : format(new Date(value), "dd MMM")
            }
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => {
              return [`${value.toFixed(2)} ${unit}`];
            }}
            labelFormatter={(label) =>
              format(new Date(label), "dd/MM/yy HH:mm")
            }
          />
          <Bar
            dataKey={dataKeys[0]}
            fill="hsl(var(--chart-1))"
            radius={[4, 4, 0, 0]}
          />
          {dataKeys.length > 1 && (
            <Bar
              dataKey={dataKeys[1]}
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// PIE CHART
export function SimplePieChart({
  data,
}: {
  title?: string;
  data?: ChartData[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => {
            return [`${value.toFixed(2)}`];
          }}
          labelFormatter={(label) => format(new Date(label), "dd/MM/yy HH:mm")}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
