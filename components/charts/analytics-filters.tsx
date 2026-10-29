"use client";

import { CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHANNEL_META } from "@/components/shared/brand-icons";
import { RANGE_OPTIONS, type ChannelFilter, type RangeDays } from "@/lib/analytics";
import type { ChannelId } from "@/lib/types";

/** Channel → fixed categorical slot, so a channel keeps its color everywhere. */
export const CHANNEL_COLOR: Record<ChannelId, string> = {
  messenger: "var(--chart-1)",
  whatsapp: "var(--chart-3)",
  instagram: "var(--chart-5)",
  webchat: "var(--chart-4)",
};

interface AnalyticsFiltersProps {
  range: RangeDays;
  onRangeChange: (range: RangeDays) => void;
  channel?: ChannelFilter;
  onChannelChange?: (channel: ChannelFilter) => void;
}

export function AnalyticsFilters({ range, onRangeChange, channel, onChannelChange }: AnalyticsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={String(range)} onValueChange={(v) => onRangeChange(Number(v) as RangeDays)}>
        <SelectTrigger className="w-40" aria-label="Date range">
          <CalendarDays className="text-muted-foreground" aria-hidden="true" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RANGE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {channel !== undefined && onChannelChange && (
        <Select value={channel} onValueChange={(v) => onChannelChange(v as ChannelFilter)}>
          <SelectTrigger className="w-40" aria-label="Channel">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            {(Object.keys(CHANNEL_META) as ChannelId[]).map((c) => (
              <SelectItem key={c} value={c}>
                {CHANNEL_META[c].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
