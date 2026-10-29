"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Bot, CheckCircle2, MessagesSquare, Timer } from "lucide-react";
import { PageContainer, PageIntro } from "@/components/shared/page-intro";
import { StatCard } from "@/components/shared/stat-card";
import { CHANNEL_META } from "@/components/shared/brand-icons";
import { ChartCard } from "@/components/charts/chart-card";
import { BarList } from "@/components/charts/bar-list";
import { AnalyticsFilters } from "@/components/charts/analytics-filters";
import {
  AiUsageTrendChart,
  ChannelPerformanceChart,
  ConversationVolumeChart,
  HourlyActivityChart,
} from "@/components/charts/charts";
import { delta, getSeries, summarize, type ChannelFilter, type RangeDays } from "@/lib/analytics";
import { TOPIC_LABELS, TOPIC_SHARE } from "@/lib/mock-data/analytics";
import { formatDuration, formatNumber, formatPercent, formatShortDate } from "@/lib/format";
import type { ChannelId, ConversationTopic } from "@/lib/types";

function hourLabel(hour: number) {
  const suffix = hour < 12 ? "am" : "pm";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}${suffix}`;
}

export function AnalyticsView() {
  const [range, setRange] = useState<RangeDays>(30);
  const [channel, setChannel] = useState<ChannelFilter>("all");

  const series = useMemo(() => getSeries(range, channel), [range, channel]);
  const current = useMemo(() => summarize(series), [series]);
  const previous = useMemo(() => summarize(getSeries(range, channel, 1)), [range, channel]);

  const channelData = useMemo(() => {
    const all = getSeries(range, "all");
    return (Object.keys(CHANNEL_META) as ChannelId[])
      .filter((c) => channel === "all" || c === channel)
      .map((c) => {
        const conversations = all.reduce((s, d) => s + d.byChannel[c], 0);
        const resolved = all.reduce((s, d) => s + Math.round((d.resolved * d.byChannel[c]) / d.conversations), 0);
        return { channel: CHANNEL_META[c].label, conversations, resolved };
      });
  }, [range, channel]);

  const hourly = useMemo(
    () =>
      Array.from({ length: 24 }, (_, hour) => ({
        hour: hourLabel(hour),
        conversations: Math.round(series.reduce((s, d) => s + (d.byHour[hour] ?? 0), 0) / Math.max(1, series.length)),
      })),
    [series],
  );

  const topics = useMemo(
    () =>
      (Object.keys(TOPIC_SHARE) as ConversationTopic[]).map((t) => ({
        key: t,
        label: TOPIC_LABELS[t],
        value: Math.round(current.totalConversations * TOPIC_SHARE[t]),
      })),
    [current.totalConversations],
  );

  const dailyTable = {
    headers: ["Date", "Conversations", "Resolved", "AI replies", "Handoffs"],
    rows: series.map((d) => [formatShortDate(d.date), d.conversations, d.resolved, d.aiMessages, d.handoffs]),
  };

  return (
    <PageContainer>
      <PageIntro
        description="Track conversation volume, resolution, and how much work your AI assistant handles. Sample data."
        actions={<AnalyticsFilters range={range} onRangeChange={setRange} channel={channel} onChannelChange={setChannel} />}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total conversations" value={formatNumber(current.totalConversations)} icon={MessagesSquare} change={delta(current.totalConversations, previous.totalConversations)} />
        <StatCard label="Resolution rate" value={formatPercent(current.resolutionRate, 1)} icon={CheckCircle2} change={delta(current.resolutionRate, previous.resolutionRate)} />
        <StatCard label="AI-assisted" value={formatNumber(current.aiAssisted)} icon={Bot} change={delta(current.aiAssisted, previous.aiAssisted)} />
        <StatCard label="Human handoff rate" value={formatPercent(current.handoffRate, 1)} icon={ArrowRightLeft} change={delta(current.handoffRate, previous.handoffRate)} invert />
        <StatCard label="Avg. response time" value={formatDuration(current.avgFirstResponseSec)} icon={Timer} change={delta(current.avgFirstResponseSec, previous.avgFirstResponseSec)} invert />
      </div>

      <ChartCard title="Conversation volume" description="Daily conversations and resolutions" table={dailyTable}>
        <ConversationVolumeChart data={series} height={300} />
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Channel performance"
          description="Conversations and resolutions by channel"
          table={{ headers: ["Channel", "Conversations", "Resolved"], rows: channelData.map((c) => [c.channel, c.conversations, c.resolved]) }}
        >
          <ChannelPerformanceChart data={channelData} />
        </ChartCard>
        <ChartCard title="Conversation topics" description="Share of conversations by detected topic">
          <BarList items={topics} />
        </ChartCard>
        <ChartCard
          title="Daily activity"
          description="Average conversations by hour of day (Dhaka time)"
          table={{ headers: ["Hour", "Avg. conversations"], rows: hourly.map((h) => [h.hour, h.conversations]) }}
        >
          <HourlyActivityChart data={hourly} />
        </ChartCard>
        <ChartCard title="AI usage trend" description="AI replies sent per day" table={dailyTable}>
          <AiUsageTrendChart data={series} />
        </ChartCard>
      </div>
    </PageContainer>
  );
}
