import type { AnalyticsMetrics, ChannelId, DailyMetrics } from "@/lib/types";
import { dailyMetrics } from "@/lib/mock-data/analytics";

export type RangeDays = 7 | 14 | 30;
export type ChannelFilter = ChannelId | "all";

export const RANGE_OPTIONS: { value: RangeDays; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
];

/** Scales a day's totals down to a single channel's share of traffic. */
function forChannel(day: DailyMetrics, channel: ChannelFilter): DailyMetrics {
  if (channel === "all") return day;
  const ratio = day.byChannel[channel] / day.conversations;
  const scale = (n: number) => Math.round(n * ratio);
  return {
    ...day,
    conversations: day.byChannel[channel],
    resolved: scale(day.resolved),
    aiResolved: scale(day.aiResolved),
    humanHandled: day.byChannel[channel] - scale(day.aiResolved),
    handoffs: scale(day.handoffs),
    aiMessages: scale(day.aiMessages),
    byHour: day.byHour.map(scale),
  };
}

/** Returns the most recent `range` days, offset by `periodsBack` whole ranges. */
export function getSeries(range: RangeDays, channel: ChannelFilter = "all", periodsBack = 0): DailyMetrics[] {
  const end = dailyMetrics.length - range * periodsBack;
  return dailyMetrics.slice(Math.max(0, end - range), end).map((d) => forChannel(d, channel));
}

export function summarize(series: DailyMetrics[]): AnalyticsMetrics {
  const sum = (pick: (d: DailyMetrics) => number) => series.reduce((acc, d) => acc + pick(d), 0);
  const total = sum((d) => d.conversations);
  const resolved = sum((d) => d.resolved);
  const aiResolved = sum((d) => d.aiResolved);
  const handoffs = sum((d) => d.handoffs);
  const weightedResponse = sum((d) => d.avgFirstResponseSec * d.conversations);
  return {
    totalConversations: total,
    resolved,
    resolutionRate: total ? resolved / total : 0,
    aiAssisted: aiResolved + handoffs,
    aiResolutionRate: resolved ? aiResolved / resolved : 0,
    handoffRate: total ? handoffs / total : 0,
    avgFirstResponseSec: total ? weightedResponse / total : 0,
    aiMessages: sum((d) => d.aiMessages),
  };
}

/** Relative change between two values, or null when there is no baseline. */
export function delta(current: number, previous: number): number | null {
  if (!previous) return null;
  return (current - previous) / previous;
}
