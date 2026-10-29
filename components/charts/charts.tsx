"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatShortDate } from "@/lib/format";
import type { DailyMetrics } from "@/lib/types";

/*
 * Chart conventions: categorical slots come from --chart-1..5 (validated
 * palette), one y-axis per chart, recessive grid, 2px lines, rounded bar
 * ends, a legend whenever there are two or more series, and hover tooltips.
 */

const axisProps = {
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  fontSize: 11,
} as const;

function dayTick(value: string) {
  return formatShortDate(value);
}

const volumeConfig = {
  conversations: { label: "Conversations", color: "var(--chart-1)" },
  resolved: { label: "Resolved", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function ConversationVolumeChart({ data, height = 260 }: { data: DailyMetrics[]; height?: number }) {
  return (
    <ChartContainer config={volumeConfig} className="aspect-auto w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-conversations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-conversations)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-conversations)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={dayTick} minTickGap={24} {...axisProps} />
        <YAxis width={44} {...axisProps} />
        <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent labelFormatter={(_, p) => formatShortDate(String(p?.[0]?.payload?.date ?? ""))} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="conversations"
          type="monotone"
          stroke="var(--color-conversations)"
          strokeWidth={2}
          fill="url(#fill-conversations)"
          activeDot={{ r: 4 }}
        />
        <Area
          dataKey="resolved"
          type="monotone"
          stroke="var(--color-resolved)"
          strokeWidth={2}
          fill="transparent"
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const aiHumanConfig = {
  aiResolved: { label: "Resolved by AI", color: "var(--chart-1)" },
  humanHandled: { label: "Handled by team", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function AiVsHumanChart({ data, height = 260 }: { data: DailyMetrics[]; height?: number }) {
  return (
    <ChartContainer config={aiHumanConfig} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={dayTick} minTickGap={16} {...axisProps} />
        <YAxis width={44} {...axisProps} />
        <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent labelFormatter={(_, p) => formatShortDate(String(p?.[0]?.payload?.date ?? ""))} />} />
        <ChartLegend content={<ChartLegendContent />} />
        {/* Surface-colored stroke creates the 2px gap between stacked segments. */}
        <Bar dataKey="aiResolved" stackId="a" fill="var(--color-aiResolved)" stroke="var(--card)" strokeWidth={2} maxBarSize={36} />
        <Bar
          dataKey="humanHandled"
          stackId="a"
          fill="var(--color-humanHandled)"
          stroke="var(--card)"
          strokeWidth={2}
          radius={[4, 4, 0, 0]}
          maxBarSize={36}
        />
      </BarChart>
    </ChartContainer>
  );
}

const aiUsageConfig = {
  aiMessages: { label: "AI replies sent", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function AiUsageTrendChart({ data, height = 240 }: { data: DailyMetrics[]; height?: number }) {
  return (
    <ChartContainer config={aiUsageConfig} className="aspect-auto w-full" style={{ height }}>
      <LineChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={dayTick} minTickGap={24} {...axisProps} />
        <YAxis width={44} {...axisProps} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(_, p) => formatShortDate(String(p?.[0]?.payload?.date ?? ""))} />} />
        <Line dataKey="aiMessages" type="monotone" stroke="var(--color-aiMessages)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ChartContainer>
  );
}

const hourlyConfig = {
  conversations: { label: "Avg. conversations", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function HourlyActivityChart({ data, height = 240 }: { data: { hour: string; conversations: number }[]; height?: number }) {
  return (
    <ChartContainer config={hourlyConfig} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="hour" interval={2} {...axisProps} />
        <YAxis width={44} {...axisProps} />
        <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent />} />
        <Bar dataKey="conversations" fill="var(--color-conversations)" radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ChartContainer>
  );
}

const channelConfig = {
  conversations: { label: "Conversations", color: "var(--chart-1)" },
  resolved: { label: "Resolved", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function ChannelPerformanceChart({
  data,
  height = 240,
}: {
  data: { channel: string; conversations: number; resolved: number }[];
  height?: number;
}) {
  return (
    <ChartContainer config={channelConfig} className="aspect-auto w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }} barGap={2}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="channel" {...axisProps} />
        <YAxis width={44} {...axisProps} />
        <ChartTooltip cursor={{ fillOpacity: 0.5 }} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="conversations" fill="var(--color-conversations)" radius={[4, 4, 0, 0]} maxBarSize={32} />
        <Bar dataKey="resolved" fill="var(--color-resolved)" radius={[4, 4, 0, 0]} maxBarSize={32} />
      </BarChart>
    </ChartContainer>
  );
}
